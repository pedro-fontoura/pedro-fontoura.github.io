<?php

//**

$file_contents = file_get_contents("./categories.json");
$json_categories = json_decode($file_contents, true);


define("SAVE_DATA", true);

$sql_id_category = 0;
$sql_id_subcategory = 0;

if ( SAVE_DATA ) {
	include( "../xhr/configure-xhr.php" );
	include( "../xhr/configure-mysql.php" );
	
	$mysql = new cfgMySQL();
	$mysql->Open();
}

echo "<dl>\n";
foreach ( $json_categories as $idx_c => $category ) {
	$sql_id_category += 1;
	
	$json_categories[ $idx_c ][ ' sql_id' ] = $sql_id_category;
	
	echo "<dt>";
	echo $idx_c . " - " . $category['id'] . " - " . $category['name'];
	echo "</dt>\n";
	
	if ( SAVE_DATA ) {
		$id_categoria = $mysql->InsertNewMultiple(
			"tbl_categoria",
			array(
				"nome", "chave"
			),
			array(
				$category['name'], $category['id']
			)
		);
	}
		
	foreach ( $category[ 'subcategories' ] as $idx_s => $subcategory ) {
		$sql_id_subcategory += 1;
		
		$json_categories[ $idx_c ][ 'subcategories' ][ $idx_s ][ ' sql_id' ] = $sql_id_subcategory;
		
		echo "<dd>";
		echo $subcategory[ 'id' ] . " : " . $subcategory[ 'name' ];
		echo "</dd>";
		
		if ( SAVE_DATA ) {
			$id_subcategoria = $mysql->InsertNewMultiple(
				"tbl_subcategoria",
				array(
					"nome", "chave", "ref_categoria"
				),
				array(
					$subcategory['name'], $subcategory['id'], $id_categoria
				)
			);
		}
	
	}
}
echo "</dl>\n";

echo "<pre>";
print_r( $json_categories );
echo "</pre>";


?>