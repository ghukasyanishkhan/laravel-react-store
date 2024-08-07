<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/items', [ItemController::class, 'index']);
Route::get('/item/{item}', [ItemController::class, 'show']);
Route::get('/index', [UserController::class, 'index']);
Route::post('/increment/{item}', [ItemController::class, 'increment']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // item routes
    Route::post('/item', [ItemController::class, 'store']);
    Route::post('/item/{item}/update', [ItemController::class, 'update']);
    Route::delete('/item/{item}', [ItemController::class, 'destroy']);

    //user routes
    Route::get('/user', [UserController::class, 'show']);
    Route::delete('/user', [UserController::class, 'destroy']);
    Route::patch('/user', [UserController::class, 'update']);
});
