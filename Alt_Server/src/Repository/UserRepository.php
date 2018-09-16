<?php
/**
 * Created by PhpStorm.
 * User: bjorn
 * Date: 16.09.18
 * Time: 03:15
 */

namespace App\Repository;


use App\Table\UserTable;
use Slim\Container;

class UserRepository extends AbstractRepository
{
    /**
     * @var UserTable
     */
    private $userTable;

    public function __construct(Container $container)
    {
        $this->userTable = $container->get(UserTable::class);
    }

    public function existsUser($username)
    {
        return $this->exists($this->userTable, ['username' => $username]);
    }

    public function getUIdByToken($token)
    {
        $query = $this->userTable->newSelect();
        $query->select(['id'])->where(['token' => $token]);
        $row = $query->execute()->fetch('assoc');
        if (empty($row)) {
            return [];
        }
        return $row['id'];
    }

    public function canLogin($username, $password)
    {
        $query = $this->userTable->newSelect();
        $query->select(['password', 'token'])->where(['username' => $username]);
        $row = $query->execute()->fetch('assoc');
        if (password_verify($password, $row['password'])) {
            return $row['token'];
        }
        return false;
    }
}
