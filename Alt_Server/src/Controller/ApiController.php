<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\Validation;
use App\Service\WalletRepository;
use Psr\Http\Message\ResponseInterface;
use Slim\Container;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;

/**
 * Class ApiController.
 */
class ApiController extends AppController
{
    /**
     * @var Router
     */
    protected $router;

    /**
     * @var Validation
     */
    private $userValidation;

    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * @var WalletRepository
     */
    private $walletRepository;

    /**
     * ApiController constructor.
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        parent::__construct($container);
        $this->router = $container->get('router');
        $this->userRepository = $container->get(UserRepository::class);
        $this->walletRepository = $container->get(WalletRepository::class);
        $this->userValidation = $container->get(Validation::class);

    }

    /**
     * Index action.
     *
     * @param Request $request
     * @param Response $response
     *
     * @return ResponseInterface
     */
    public function loginAction(Request $request, Response $response): ResponseInterface
    {
        $body = $request->getBody()->__toString();
        $data = json_decode($body, true);
        $responseData = ['success' => false, 'token' => null];
        $token = $this->userValidation->validateLogin($data['username'], $data['password']);
        if (!empty($token)) {
            $responseData = ['token' => $token, 'success' => true];
        }
        return $this->json($response, $responseData);
    }

    public function transactionsAction(Request $request, Response $response): ResponseInterface
    {
        $body = $request->getBody()->__toString();
        $token = $request->getHeader('X-Token')[0];
        $data = json_decode($body, true);
        $responseData = ['success' => false];
        $userId = $this->userRepository->getUIdByToken($token);
        $amount = abs($data['amount']);
        try {
            if ($this->userValidation->validateTransaction($userId, $amount, $data['currency_from'])) {
                if ($this->walletRepository->isCurrencyWalletCreated($userId, $data['currency_to'])) {
                    $this->walletRepository->createTransaction($userId, $data['currency_to'], $amount, $data['until']);
                    $this->walletRepository->substractFrom($userId, $data['currency_from'], $amount);
                    $responseData = ['success' => true];
                } else {
                    $id = $this->walletRepository->createNewWallet($userId, $data['currency_to']);
                    if ($id) {
                        $this->walletRepository->createTransaction($userId, $data['currency_to'], $amount, $data['until']);
                        $this->walletRepository->substractFrom($userId, $data['currency_from'], $amount);
                        $responseData = ['success' => true];
                    }
                }
            }
        } catch (\Exception $e) {
            // do nothing, responsedata already false
        }

        return $this->json($response, $responseData);
    }

    public function getWalletsAction(Request $request, Response $response): ResponseInterface
    {
        $token = $request->getHeader('X-Token')[0];
        $userId = $this->userRepository->getUIdByToken($token);
        $responseData = ['wallets' => $this->walletRepository->getWallets($userId)];
        return $this->json($response, $responseData);

    }
}
