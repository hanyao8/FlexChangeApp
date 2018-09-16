<?php
/**
 * Created by PhpStorm.
 * User: bjorn
 * Date: 16.09.18
 * Time: 03:33
 */

namespace App\Service;


use App\Repository\AbstractRepository;
use App\Table\TransactionTable;
use App\Table\UserTable;
use App\Table\WalletTable;
use Slim\Container;

class WalletRepository extends AbstractRepository
{

    /**
     * @var UserTable
     */
    private $userTable;

    /**
     * @var WalletTable
     */
    private $walletTable;

    /**
     * @var TransactionTable
     */
    private $transactionTable;

    public function __construct(Container $container)
    {
        $this->userTable = $container->get(UserTable::class);
        $this->walletTable = $container->get(WalletTable::class);
        $this->transactionTable = $container->get(TransactionTable::class);
    }

    public function isEnoughMoneyAvailable($userId, $currency, $amount)
    {
        $query = $this->walletTable->newSelect();
        $query->select(['amount'])->where(['currency' => $currency, 'user_id' => $userId]);
        $row = $query->execute()->fetch('assoc');
        if (!$row) {
            return false;
        }

        return ((float)$row['amount']) >= ((float)$amount);
    }

    public function createNewWallet($userId, $currency)
    {
        $data = [
            'user_id' => $userId,
            'amount' => 0,
            'currency' => $currency,
        ];
        return $this->walletTable->insert($data)->lastInsertId();
    }

    public function isCurrencyWalletCreated($userId, $currency)
    {
        $query = $this->walletTable->newSelect();
        $query->select(1)->where(['currency' => $currency, 'user_id' => $userId]);
        $data = $query->execute()->fetch();
        return !empty($data);
    }


    public function createTransaction($userId, $toCurrency, $amount, $until)
    {
        $query = $this->walletTable->newSelect();
        $query->select(['id'])->where(['user_id' => $userId]);
        $walletIdFrom = $query->execute()->fetch('assoc')['id'];
        $q = $this->walletTable->newSelect();
        $q->select(['id'])->where(['user_id' => $userId, 'currency' => $toCurrency]);
        $walletIdTo = $q->execute()->fetch('assoc')['id'];
        $data = [
            'wallet_from_id' => $walletIdFrom,
            'wallet_to_id' => $walletIdTo,
            'amount' => $amount,
            'until' => $until,
        ];
        return $this->transactionTable->insert($data);
    }

    public function substractFrom($userId, $currency, $amount)
    {
        $query = $this->walletTable->newSelect();
        $query->select(['amount'])->where(['currency' => $currency, 'user_id' => $userId]);
        $row = $query->execute()->fetch('assoc');
        $orgAmount = $row['amount'];
        $finalAmount = ((float)$orgAmount) - ((float)$amount);
        $this->walletTable->update(['amount' => $finalAmount], ['user_id' => $userId, 'currency' => $currency]);
        return true;
    }

    public function getWallets($userId)
    {
        $query = $this->walletTable->newSelect();
        $query->select(['currency', 'id', 'amount'])->where(['user_id' => $userId]);
        $rows = $query->execute()->fetchAll('assoc');
        if (empty($rows)) {
            return [];
        }

        $result = [];
        foreach ($rows as $key => $row) {
            $query = $this->transactionTable->newSelect();
            $query->select(['until', 'amount', 'wallet_from_id'])->where(['wallet_to_id' => $row['id']]);
            $pending = $query->execute()->fetchAll('assoc');
            $pendingTrans = [];
            foreach ($pending as $key => $pend) {
                $q = $this->walletTable->newSelect();
                $q->select('currency')->where(['id' => $pend['wallet_from_id']]);
                $currencyTo = $q->execute()->fetch('assoc');
                $pendingTrans[] = [
                    'currency_to' => $currencyTo['currency'],
                    'amount' => $pend['amount'],
                    'until' => $pend['until'],
                ];
            }
            $result[] = [
                'currency' => $row['currency'],
                'amount' => $row['amount'],
                'pending' => $pendingTrans,
                'is_main' => false,
            ];
        }

        $result[0]['is_main'] = true;

        return $result;
    }

}