<?php

namespace App\Helpers;

class KhmerTextHelper
{
    public static function wrap(?string $text): string
    {
        if (!$text) return '';

        $escaped = e($text);

        // បញ្ចូល Zero-Width Space មុនព្យញ្ជនៈខ្មែរនីមួយៗ
        // លើកលែងតែពេលនៅភ្លាមក្រោម coeng (្)
        return preg_replace(
            '/(?<!\x{17D2})([\x{1780}-\x{17A2}])/u',
            "\u{200B}$1",
            $escaped
        );
    }

    /**
     * បញ្ចូល Thin Space (U+2009) — VISIBLE small gap
     * សម្រាប់សាកល្បង/compare តែប៉ុណ្ណោះ
     * ⚠️ នឹងបន្ថែម gap តូចៗរវាងព្យញ្ជនៈគ្រប់កន្លែង មិនមែនតែពេល wrap ទេ
     */
    public static function wrapWithVisibleGap(?string $text): string
    {
        if (!$text) return '';

        $escaped = e($text);

        return preg_replace(
            '/(?<!\x{17D2})([\x{1780}-\x{17A2}])/u',
            "\u{2009}$1",
            $escaped
        );
    }
}