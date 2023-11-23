<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\GenreResource;
use App\Http\Resources\AuthorResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'image_url' => $this->image_url,
            'description' => $this->description,
            'isbn' => $this->isbn,
            'published_at' => $this->published_at,

            'genres' => GenreResource::collection($this->genres),
            'authors' => AuthorResource::collection($this->authors),
        ];
    }
}
