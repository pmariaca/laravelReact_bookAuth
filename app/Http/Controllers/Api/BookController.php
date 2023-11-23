<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Http\Resources\GenreResource;
use App\Http\Resources\AuthorResource;
use App\Models\Book;
use App\Models\Genre;
use App\Models\Author;
use App\Models\BookGenre;
use App\Models\AuthorBook;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return BookResource::collection(
            Book::query()->orderBy('title', 'asc')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request)
    {
        $request->validated();
        $filePath = null;
        $file = $request->image_url;
        if ($request->hasFile('image_url')) {
            $filePath = $file->storeAs('images', time() . '' . $file->getClientOriginalName(), 'public');
        }

        $form_data = [
            'title' => $request->title,
            'image_url' => $filePath,
            'description' => $request->description,
            'isbn' => $request->isbn,
            'published_at' => $request->published_at,
        ];
        $book = Book::create($form_data);
        $id = $book->id;
        foreach ($request->genres as $ids) {
            BookGenre::create([
                'book_id' => $id,
                'genre_id' => $ids
            ]);
        }
        foreach ($request->authors as $ids) {
            AuthorBook::create([
                'book_id' => $id,
                'author_id' => $ids
            ]);
        }
        return response(new BookResource($book), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $booki)
    {
        if ($booki == 0) {
            return (json_encode([
                'allgenres' => GenreResource::collection(Genre::query()->orderBy('genre', 'desc')->get()),
                'allauthors' =>  AuthorResource::collection(Author::query()->orderBy('name')->get())
            ]));
        }

        $book = Book::find($booki);
        $book->image_url = Storage::url($book->image_url);
        return (json_encode([
            'data' => new BookResource($book),
            'allgenres' => GenreResource::collection(Genre::query()->orderBy('genre', 'desc')->get()),
            'allauthors' =>  AuthorResource::collection(Author::query()->orderBy('name')->get())
        ]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request): mixed
    {
        $request->validated();

        $book = Book::find($request->id);

        $filePath = null;
        $file = $request->image_url;
        if ($request->hasFile('image_url')) {
            $filePath = time() . '' . $file->getClientOriginalName();
            $book->image_url = $filePath;
        }

        $book->title = $request->title;
        $book->description = $request->description;
        $book->isbn = $request->isbn;
        $book->published_at = $request->published_at;

        if (array_key_exists('image_url',$request->all())  && $request->image_url==null ) {
            $book->image_url = $filePath;
        }

        if ($book->isDirty()) {
            if ($book->isDirty('image_url')) {
                if($book->getOriginal('image_url') !=null && Storage::disk('public')->exists($book->getOriginal('image_url')) ){
                    Storage::disk('public')->delete($book->getOriginal('image_url'));
                    $book->image_url = null;
                }
                if ($request->hasFile('image_url')) {
                    $filePath = $file->storeAs('images', $filePath, 'public');
                    $book->image_url = $filePath;
                }
            }
            $book->update();
        }

        $this->findBookGendre($request->genres, $book);
        $this->findBookAuthor($request->authors, $book);
        return new BookResource($book);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return response('', 204);
    }

    private function findBookAuthor($elAuthors, $book)
    {
        $cat_id = $cat_id_o = [];
        $cat = AuthorBook::where('book_id', $book->id)->get();
        foreach ($cat as $ids) {
            $cat_id_o[$ids->author_id] = $ids->author_id;
        }
        foreach ($elAuthors as $ids) {
            $cat_id[$ids] = $ids;
        }
        $delete = array_diff($cat_id_o, $cat_id);
        $new = array_diff($cat_id, $cat_id_o);
        if (!empty($delete)) {
            $cats = AuthorBook::where('book_id', $book->id)
                ->whereIn('author_id', $delete);
            $cats->delete();
        }
        foreach ($new as $ids) {
            AuthorBook::create([
                'book_id' => $book->id,
                'author_id' => $ids
            ]);
        }
    }

    private function findBookGendre($elGenres, $book)
    {
        $cat_id = $cat_id_o = [];
        $cat = BookGenre::where('book_id', $book->id)->get();
        foreach ($cat as $ids) {
            $cat_id_o[$ids->genre_id] = $ids->genre_id;
        }
        foreach ($elGenres as $ids) {
            $cat_id[$ids] = $ids;
        }
        $delete = array_diff($cat_id_o, $cat_id);
        $new = array_diff($cat_id, $cat_id_o);
        if (!empty($delete)) {
            $cats = BookGenre::where('book_id', $book->id)
                ->whereIn('genre_id', $delete);
            $cats->delete();
        }
        foreach ($new as $ids) {
            BookGenre::create([
                'book_id' => $book->id,
                'genre_id' => $ids
            ]);
        }
    }
}
