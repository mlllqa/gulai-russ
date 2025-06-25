<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('price');
            $table->integer('seats_total');
            $table->integer('seats_available');
            $table->text('description')->nullable();
            $table->string('status')->default('активен');
            $table->foreignId('city_id')->constrained('cities');
            $table->foreignId('type_id')->constrained('tour_types');
            $table->text('program')->nullable();
            $table->text('included')->nullable();
            $table->text('what_to_take')->nullable();
            $table->json('tags')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
