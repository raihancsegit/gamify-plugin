<?php

namespace Gamify\System;

class Trigger_Engine
{
    /**
     * @var array All available triggers in our system.
     */
    private $available_triggers = [];

    public function __construct()
    {
        $this->define_triggers();
        $this->attach_hooks();
    }

    /**
     * Define all hooks that can be used as triggers.
     * This is where you add new triggers for the drag & drop UI.
     */
    private function define_triggers()
    {
        $this->available_triggers = [
            'wp_login' => [
                'label' => 'User logs in',
                'hook' => 'wp_login',
                'args' => 2, // How many arguments the hook passes
                'get_user_id' => function ($user_login, $user) {
                    return $user->ID;
                }
            ],
            'publish_post' => [
                'label' => 'User publishes a new post',
                'hook' => 'publish_post',
                'args' => 2,
                'get_user_id' => function ($post_id, $post) {
                    return $post->post_author;
                }
            ],
            // Add more triggers here...
            'comment_post' => [
                'label' => 'User posts a comment',
                'hook' => 'comment_post',
                'args' => 1,
                'get_user_id' => function ($comment_id) {
                    $comment = get_comment($comment_id);
                    return $comment->user_id;
                }
            ]
        ];
    }

    /**
     * Attach all defined WordPress hooks dynamically.
     */
    private function attach_hooks()
    {
        foreach ($this->available_triggers as $key => $trigger_data) {
            add_action($trigger_data['hook'], function () use ($key, $trigger_data) {
                // Get all arguments passed by the hook
                $args = func_get_args();
                $this->execute_trigger($key, $trigger_data, $args);
            }, 10, $trigger_data['args']);
        }
    }

    /**
     * The main function that executes when a hook is fired.
     *
     * @param string $key The unique key of the trigger.
     * @param array  $trigger_data The trigger's configuration.
     * @param array  $hook_args The arguments passed by the WordPress hook.
     */
    public function execute_trigger($key, $trigger_data, $hook_args)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'gamify_triggers';

        // Find the rule for this trigger in the database
        $rule = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table_name} WHERE trigger_key = %s AND is_active = 1", $key));

        if (! $rule || $rule->points_to_award == 0) {
            return; // No active rule found for this trigger, or points are zero.
        }

        // Get the user ID from the hook arguments
        $user_id = call_user_func_array($trigger_data['get_user_id'], $hook_args);

        if (! $user_id) {
            return; // Could not determine the user.
        }

        $points = (int) $rule->points_to_award;
        $description = ! empty($rule->log_description) ? $rule->log_description : $trigger_data['label'];

        // Use our helper functions to add or deduct points
        if ($points > 0) {
            \gamify_add_points($user_id, $points, $key, ['description' => $description]);
        } elseif ($points < 0) {
            \gamify_deduct_points($user_id, abs($points), $key, ['description' => $description]);
        }
    }

    /**
     * Get all defined triggers to show in the drag & drop UI.
     * @return array
     */
    public function get_available_triggers()
    {
        return $this->available_triggers;
    }
}
