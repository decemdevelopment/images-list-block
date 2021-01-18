<?php
/*
Plugin Name: Images List Block
*/

function images_list_block_register_block()
{

	// Register JavasScript File build/index.js
	wp_register_script(
		'images-list-block',
		plugins_url('build/index.js', __FILE__),
		array('wp-blocks', 'wp-element', 'wp-editor'),
		filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
	);

	// Register editor style build/index.css
	wp_register_style(
		'images-list-block-editor-style',
		plugins_url('build/index.css', __FILE__),
		array('wp-edit-blocks'),
		filemtime(plugin_dir_path(__FILE__) . 'build/index.css')
	);

	// Register front end block style build/style-index.css
	wp_register_style(
		'images-list-block-frontend-style',
		plugins_url('build/style-index.css', __FILE__),
		array(),
		filemtime(plugin_dir_path(__FILE__) . 'build/style-index.css')
	);

	// Register your block
	register_block_type('images-list-block/example', array(
		'editor_script' => 'images-list-block',
		'editor_style' => 'images-list-block-editor-style',
		'style' => 'images-list-block-frontend-style',
	));
}

add_action('init', 'images_list_block_register_block');

function images_list_block_frontend_scripts()
{
	wp_enqueue_script(
		'image-list-block-hovers',
		plugins_url('src/plugins/list-items.js', __FILE__),
		array(),
		filemtime(plugin_dir_path(__FILE__) . 'src/plugins/list-items.js'),
		true
	);
}

add_action('wp_enqueue_scripts', 'images_list_block_frontend_scripts');
