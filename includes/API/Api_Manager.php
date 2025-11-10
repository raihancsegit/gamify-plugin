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

        register_rest_route($this->namespace, '/triggers', [
            [
                'methods'  => 'GET',
                'callback' => [$this, 'get_triggers'],
                'permission_callback' => [$this, 'admin_permission_check'],
            ],
            [
                'methods'  => 'POST',
                'callback' => [$this, 'save_triggers'],
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


    public function get_triggers(\WP_REST_Request $request)
    {
        $engine = new \Gamify\System\Trigger_Engine();
        $available_triggers = $engine->get_available_triggers();

        global $wpdb;
        $active_triggers_raw = $wpdb->get_results("SELECT trigger_key, points_to_award FROM {$wpdb->prefix}gamify_triggers WHERE is_active = 1", OBJECT_K);

        $active_triggers = [];
        foreach ($active_triggers_raw as $key => $data) {
            $active_triggers[$key] = $data->points_to_award;
        }

        return new \WP_REST_Response([
            'available' => $available_triggers,
            'active'    => $active_triggers,
        ], 200);
    }

    public function save_triggers(\WP_REST_Request $request)
    {
        $active_hooks = $request->get_param('active_hooks'); // Expects an object like: { "wp_login": 10, "publish_post": 50 }

        if (! is_array($active_hooks)) {
            return new \WP_Error('invalid_data', 'Invalid data format.', ['status' => 400]);
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'gamify_triggers';

        // First, deactivate all existing triggers
        $wpdb->query("UPDATE {$table_name} SET is_active = 0");

        foreach ($active_hooks as $key => $points) {
            $points = intval($points);
            if ($points == 0) continue;

            // Check if the trigger already exists
            $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$table_name} WHERE trigger_key = %s", $key));

            if ($exists) {
                // Update existing trigger
                $wpdb->update($table_name, ['points_to_award' => $points, 'is_active' => 1], ['trigger_key' => $key]);
            } else {
                // Insert new trigger
                $wpdb->insert($table_name, ['trigger_key' => $key, 'points_to_award' => $points, 'is_active' => 1]);
            }
        }

        return new \WP_REST_Response(['message' => 'Settings saved successfully.'], 200);
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
