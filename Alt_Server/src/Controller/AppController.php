<?php

namespace App\Controller;

use Aura\Session\Segment;
use Aura\Session\Session;
use Interop\Container\Exception\ContainerException;
use Monolog\Logger;
use Psr\Http\Message\ResponseInterface;
use Slim\Container;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Router;
use Slim\Views\Twig;

/**
 * Class AppController.
 */
class AppController
{
    /**
     * @var Request
     */
    protected $request;

    /**
     * @var Response
     */
    protected $response;

    /**
     * @var Segment
     */
    protected $session;

    /**
     * @var Router
     */
    protected $router;

    /**
     * @var Logger
     */
    protected $logger;


    /**
     * @var Session
     */
    private $sessionHandler;

    /**
     * AppController constructor.
     *
     * @param Container $container
     *
     * @throws ContainerException
     */
    public function __construct(Container $container)
    {
        $this->request = $container->get('request');
        $this->response = $container->get('response');
        $this->sessionHandler = $container->get(Session::class);
        $this->session = $this->sessionHandler->getSegment('app');
        $this->router = $container->get('router');
        $this->logger = $container->get(Logger::class);
    }

    /**
     * Return JSON Response.
     *
     * @param Response $response
     * @param array $data
     * @param int $status
     *
     * @return ResponseInterface
     */
    protected function json(Response $response, $data, int $status = 200): ResponseInterface
    {
        return $response->withJson($data, $status);
    }

    /**
     * Return redirect.
     *
     * @param Response $response
     * @param string $url
     * @param int $status
     *
     * @return ResponseInterface
     */
    public function redirect(Response $response, string $url, int $status = 301): ResponseInterface
    {
        return $response->withRedirect($url, $status);
    }
}
