<?php

/**
 * Plugin Name:       Gamify
 * Description:       A modern gamification plugin for WordPress with a React-based admin panel.
 * Version:           1.0.0
 * Author:            Your Name
 * Text Domain:       gamify
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (! defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('GAMIFY_PATH', plugin_dir_path(__FILE__));
define('GAMIFY_URL', plugin_dir_url(__FILE__));

// Require the autoloader
if (file_exists(GAMIFY_PATH . 'vendor/autoload.php')) {
    require_once GAMIFY_PATH . 'vendor/autoload.php';
}

/**
 * Register the activation hook.
 */
function gamify_activate()
{
    $installer = new \Gamify\Core\Installer();
    $installer->run();
}
register_activation_hook(__FILE__, 'gamify_activate');

/**
 * The main function to run the plugin.
 */
function gamify_run()
{
    // Initialize the main plugin class
    \Gamify\Core\Loader::instance();
}
gamify_run();
