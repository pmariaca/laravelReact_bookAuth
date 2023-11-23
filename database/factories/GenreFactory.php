<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Genre>
 */
class GenreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $genre = $this->faker->unique()->randomElement(['Manga', 'Suspence','Ciencia', 'Mitos y leyendas','Cuento', 'Mitos y leyendas','Biografía', 'Novela','Poesía', 'Periodísticos']);

        return [
            'genre' => $genre
        ];
    }
}
