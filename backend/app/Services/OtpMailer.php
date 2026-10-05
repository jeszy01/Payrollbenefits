<?php

namespace App\Services;

use Resend;

class OtpMailer
{
    public static function send(string $to, string $code): void
    {
        $key = config('services.resend_keys')[strtolower($to)] ?? null;
        if (!$key) {
            throw new \Exception('No Resend key for this email');
        }

        Resend::client($key)->emails->send([
            'from' => 'Archon Nell Payroll <onboarding@resend.dev>',
            'to' => [$to],
            'subject' => 'Your login code',
            'html' => "<p>Your code is <strong>{$code}</strong></p>",
        ]);
    }
}
