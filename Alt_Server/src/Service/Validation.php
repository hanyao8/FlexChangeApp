<?php
/**
 * Created by PhpStorm.
 * User: bjorn
 * Date: 16.09.18
 * Time: 03:14
 */

namespace App\Service;


use App\Repository\UserRepository;
use Slim\Container;

class Validation
{
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var WalletRepository
     */
    private $walletRepository;

    public function __construct(Container $container)
    {
        $this->userRepository = $container->get(UserRepository::class);
        $this->walletRepository = $container->get(WalletRepository::class);
    }

    public function validateLogin($username, $password)
    {
        if (!$this->userRepository->existsUser(strtolower($username))) {
            return false;
        }

        $token = $this->userRepository->canLogin(strtolower($username), $password);
        if (!empty($token)) {
            return $token;
        }

        return false;
    }

    public function validateTransaction($userId, $amount, $currencyFrom)
    {
        return $this->walletRepository->isEnoughMoneyAvailable($userId, $currencyFrom, $amount);
    }
}
