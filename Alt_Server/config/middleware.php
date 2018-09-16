<?php

use App\Repository\UserRepository;
use Slim\Http\Request;
use Slim\Http\Response;

$container = $app->getContainer();

$app->add(function (Request $request, Response $response, callable $next) use ($container) {
    /**
     * @var $userRepo UserRepository
     */
    $userRepo = $container->get(UserRepository::class);
    if (preg_match('/.*login.*/i', $request->getRequestTarget())) {
        return $next($request, $response);
    }

    $token = $request->getHeader('X-Token')[0];
    if ($userRepo->getUIdByToken($token)) {
        return $next($request, $response);
    }

    return $response->withStatus(401);
});

/**
 * Options middleware
 */
$app->add(function (Request $request, Response $response, $next) {
    $method = $request->getMethod();
    if (strtoupper($method) == 'OPTIONS') {
        return $response->withStatus(200);
    }
    return $next($request, $response);
});

/**
 * For CORS
 */
$app->add(function (Request $request, Response $response, $next) use ($container) {
    /** @var Response $response */
    $response = $next($request, $response);
    $response = $response->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'Authentication, X-App-Language, X-Token, Content-Type')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return $response;
});