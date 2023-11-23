<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $r = rand(2,3);
        return [
            'title' => $this->faker->words($r, true),  //sentence($r),
            'description' => $this->faker->paragraph(),//->sentence(10),//->paragraph(),
            'isbn' => $this->faker->isbn13(),
            'published_at' => $this->faker->date()
        ];
    }
}
