<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Genre;
use App\Models\Author;

class Book extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'image_url','description', 'isbn', 'published_at'];

    public function authors():BelongsToMany
    {
        return $this->belongsToMany(Author::class);
    }

    public function genres():BelongsToMany
    {
        return $this->belongsToMany(Genre::class);
    }
}
