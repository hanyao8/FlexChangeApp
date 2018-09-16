<?php
$language = '{language:(?:de|en)}';

$app->post('/login', 'App\Controller\ApiController:loginAction')->setName('api.login');
$app->get('/wallets', 'App\Controller\ApiController:getWalletsAction')->setName('api.wallets');
$app->post('/transaction', 'App\Controller\ApiController:transactionsAction')->setName('api.trans');