<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class FeedbackController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        Mail::raw(
            "Сообщение от: {$data['name']} ({$data['email']})\n\n{$data['message']}",
            function ($message) use ($data) {
                $message->to('curcuume@gmail.com')
                        ->subject('Новое сообщение с сайта')
                        ->replyTo($data['email'], $data['name']);
            }
        );

        return response()->json(['status' => 'ok']);
    }
}
