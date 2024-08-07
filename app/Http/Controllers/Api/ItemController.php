<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::with('user')->get();
        return response()->json(['items' => $items]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        DB::beginTransaction();
        try {
            $userId = Auth::user()->id;
            $data = $request->validated();

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $basePath = "public/$userId/items/";
                $fileName = $file->getClientOriginalName();
                $filePath = $file->storeAs($basePath, $fileName);

                $path = str_replace('public/', 'storage/', $filePath);
            } else {
                $path = null;
            }

            $item = Item::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'image_path' => $path,
                'user_id' => $userId,
            ]);

            DB::commit();

            return response()->json(compact('item'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to store item.'], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $item->name = $data['name'];
            $item->description = $data['description'];

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $userId = Auth::user()->id;
                $basePath = "public/$userId/items/";
                $fileName = $file->getClientOriginalName();
                $filePath = $file->storeAs($basePath, $fileName);

                $newPath = str_replace('public/', 'storage/', $filePath);

                if ($item->image_path) {
                    $oldFilePath = str_replace('storage/', 'public/', $item->image_path);

                    if (Storage::exists($oldFilePath)) {
                        Storage::delete($oldFilePath);
                    }
                }

                $item->image_path = $newPath;
            }

            $item->save();
            DB::commit();

            return response()->json(['item' => $item]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update item.'], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        DB::beginTransaction();
        try {
            if ($item->image_path) {
                $filePath = str_replace('storage/', 'public/', $item->image_path);

                if (Storage::exists($filePath)) {
                    Storage::delete($filePath);
                }
            }

            $item->delete();

            DB::commit();
            return response()->json(['message' => 'Item deleted successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete item'], 500);
        }
    }


    public function increment(Item $item)
    {
        $item->incrementViews();
        return response(['item' => $item]);
    }
}
