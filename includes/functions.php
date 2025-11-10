<?php
// Exit if this file is called directly.
if (! defined('ABSPATH')) {
    exit;
}

/**
 * A global helper function to easily add points to a user.
 * This is a wrapper for the Points_Manager->add_points() method.
 */
function gamify_add_points($user_id, $points, $context, $args = [])
{
    $manager = new \Gamify\System\Points_Manager();
    return $manager->add_points($user_id, $points, $context, $args);
}

/**
 * A global helper function to easily deduct points from a user.
 * This is a wrapper for the Points_Manager->deduct_points() method.
 */
function gamify_deduct_points($user_id, $points, $context, $args = [])
{
    $manager = new \Gamify\System\Points_Manager();
    return $manager->deduct_points($user_id, $points, $context, $args);
}

/**
 * A global helper function to get the total points for a user.
 * This is a wrapper for the Points_Manager->get_user_total_points() method.
 */
function gamify_get_user_total_points($user_id)
{
    $manager = new \Gamify\System\Points_Manager();
    return $manager->get_user_total_points($user_id);
}
