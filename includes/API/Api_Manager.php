<?php

namespace Gamify\API;

// Exit if accessed directly.
if (! defined('ABSPATH')) {
    exit;
}

/**
 * Handles the registration of all REST API routes.
 */
class Api_Manager
{
    /**
     * The namespace for our API.
     */
    protected $namespace = 'gamify/v1';

    /**
     * Constructor to hook into WordPress.
     */
    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register all routes for the plugin.
     */
    public function register_routes()
    {
        // Example: GET logs
        register_rest_route($this->namespace, '/logs', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_logs'],
            'permission_callback' => [$this, 'admin_permission_check'],
        ]);

        register_rest_route($this->namespace, '/point-types', [
            // GET all point types
            [
                'methods'  => 'GET',
                'callback' => [$this, 'get_point_types'],
                'permission_callback' => [$this, 'admin_permission_check'],
            ],
            // POST a new point type
            [
                'methods'  => 'POST',
                'callback' => [$this, 'create_point_type'],
                'permission_callback' => [$this, 'admin_permission_check'],
            ],
        ]);
    }

    /**
     * Get all point types.
     */
    public function get_point_types(\WP_REST_Request $request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gamify_point_types';

        $results = $wpdb->get_results("SELECT id, name, plural_name, created_at as date FROM {$table_name} ORDER BY id DESC", ARRAY_A);

        $data = array_map(function ($row) {
            $row['key'] = $row['id'];
            return $row;
        }, $results);

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Create a new point type.
     */
    public function create_point_type(\WP_REST_Request $request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gamify_point_types';

        $name = sanitize_text_field($request->get_param('name'));
        $plural_name = sanitize_text_field($request->get_param('plural_name'));

        if (empty($name) || empty($plural_name)) {
            return new \WP_Error('invalid_data', 'Name and Plural Name are required.', ['status' => 400]);
        }

        $slug = sanitize_title($name);

        $result = $wpdb->insert($table_name, [
            'name'        => $name,
            'plural_name' => $plural_name,
            'slug'        => $slug,
        ]);

        if (! $result) {
            return new \WP_Error('db_error', 'Could not create point type.', ['status' => 500]);
        }

        return new \WP_REST_Response([
            'id' => $wpdb->insert_id,
            'message' => 'Point type created successfully.'
        ], 201);
    }

    /**
     * Get logs from the database.
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_logs($request)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gamify_logs';

        // For now, let's fetch the last 20 logs
        $results = $wpdb->get_results("SELECT * FROM {$table_name} ORDER BY created_at DESC LIMIT 20", ARRAY_A);

        if (is_wp_error($results)) {
            return new \WP_REST_Response(['error' => 'Could not fetch logs.'], 500);
        }

        return new \WP_REST_Response($results, 200);
    }

    /**
     * Permission check for admin-only routes.
     *
     * @return bool
     */
    public function admin_permission_check()
    {
        return current_user_can('manage_options');
    }
}
