<?php

namespace Gamify\Admin;

// Exit if accessed directly.
if (! defined('ABSPATH')) {
    exit;
}

class Menu
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'register_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
    }

    public function register_admin_menu()
    {
        // Main Gamify Menu (Dashboard)
        add_menu_page(
            __('Gamify Dashboard', 'gamify'),
            'Gamify',
            'manage_options',
            'gamify', // Parent Slug
            [$this, 'render_admin_app'],
            'dashicons-star-filled',
            20
        );

        // Submenu: Dashboard (acts as the main page)
        add_submenu_page(
            'gamify', // Parent Slug
            __('Dashboard', 'gamify'),
            __('Dashboard', 'gamify'),
            'manage_options',
            'gamify', // Same slug as parent to link correctly
            [$this, 'render_admin_app']
        );

        // Submenu: Points System
        add_submenu_page(
            'gamify', // Parent Slug
            __('Points System', 'gamify'),
            __('Points System', 'gamify'),
            'manage_options',
            'gamify-points', // Unique slug for this page
            [$this, 'render_admin_app']
        );

        // Submenu: Logs
        add_submenu_page(
            'gamify',
            __('Logs', 'gamify'),
            __('Logs', 'gamify'),
            'manage_options',
            'gamify-logs',
            [$this, 'render_admin_app']
        );

        // Submenu: Settings
        add_submenu_page(
            'gamify',
            __('Settings', 'gamify'),
            __('Settings', 'gamify'),
            'manage_options',
            'gamify-settings',
            [$this, 'render_admin_app']
        );
    }

    public function render_admin_app()
    {
        echo '<div id="gamify-admin-app"></div>';
    }

    public function enqueue_admin_scripts($hook)
    {
        // Load scripts on all our admin pages
        $pages = [
            'toplevel_page_gamify',
            'gamify_page_gamify-points',
            'gamify_page_gamify-logs',
            'gamify_page_gamify-settings'
        ];

        if (! in_array($hook, $pages)) {
            return;
        }

        // ... (The rest of the enqueue code remains the same) ...
        wp_enqueue_style(
            'gamify-admin-style',
            GAMIFY_URL . 'admin/dist/assets/main.css',
            [],
            filemtime(GAMIFY_PATH . 'admin/dist/assets/main.css')
        );

        // CSS to hide all admin notices on our pages
        // $custom_css = '
        //     .notice, 
        //     .updated, 
        //     .error, 
        //     #wpbody-content > .update-nag { 
        //         display: none !important; 
        //     }
        // ';
        // wp_add_inline_style('gamify-admin-style', $custom_css);

        wp_enqueue_script(
            'gamify-admin-script',
            GAMIFY_URL . 'admin/dist/assets/main.js',
            ['wp-element'],
            filemtime(GAMIFY_PATH . 'admin/dist/assets/main.js'),
            true
        );

        // Pass data from PHP to our React app
        wp_localize_script(
            'gamify-admin-script',
            'gamifyApiSettings',
            [
                'nonce' => wp_create_nonce('wp_rest'),
            ]
        );
    }
}
