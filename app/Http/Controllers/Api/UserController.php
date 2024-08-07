<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('items')->get();

        return response()->json(compact('users'));
    }


    public function show(User $user)
    {
        $user = Auth::user();
        $userItems = $user->items;
        return response(['user' => $user,'items'=>$userItems]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        /** @var  $user User */
        $data = $request->validated();
        $data['new_password'] = $data['new_password'] !== null ? bcrypt($data['new_password']) : Auth::user()->password;
        $user = Auth::user();
        if ($user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['new_password']
        ])) {
            return response()->json(['success' => 'Profile updated']);
        }
        return response()->json(['error' => 'Failed to update profile']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        /** @var $user User */
        $user = Auth::user();
        if ($user) {
            DB::beginTransaction();
            try {
                foreach ($user->items as $item) {
                    if ($item->image_path) {
                        $filePath = str_replace('storage/', 'public/', $item->image_path);

                        if (Storage::exists($filePath)) {
                            Storage::delete($filePath);
                        }
                    }
                    $item->delete();
                }

                $userDir = "public/{$user->id}/";
                if (Storage::exists($userDir)) {
                    Storage::deleteDirectory($userDir);
                }

                if ($user->tokens()->delete() && $user->delete()) {
                    DB::commit();
                    return response()->json(['success' => 'Profile deleted successfully']);
                }

                DB::rollBack();
                return response()->json(['error' => 'Failed to delete profile']);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Failed to delete profile'], 500);
            }
        }

        return response()->json(['error' => 'User not found'], 404);
    }



}

