<?php

namespace Gamify\Core;

use Gamify\Admin\Menu;
use Gamify\API\Api_Manager;
use Gamify\System\Trigger_Engine;

// Exit if accessed directly.
if (! defined('ABSPATH')) {
    exit;
}

final class Loader
{

    private static $_instance = null;

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    private function __construct()
    {
        $this->init_classes();
    }

    /**
     * Initializes all the necessary classes.
     */
    private function init_classes()
    {
        new Menu();
        new Api_Manager();
        new Trigger_Engine();
    }
}
