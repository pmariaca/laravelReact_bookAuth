<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Book::factory()
            ->count(5)
            ->hasGenres(1)
            ->hasAuthors(1)
            ->create();

        Book::factory()
            ->count(2)
            ->hasGenres(2)
            ->hasAuthors(2)
            ->create();
    }
}
