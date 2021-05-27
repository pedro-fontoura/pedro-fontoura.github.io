<?php

//**

$file_contents = file_get_contents("./activities_new.json");
$json_activities = json_decode($file_contents, true);

define("SAVE_ACT", true);

$sql_id_activity = 0;

include( "../xhr/configure-xhr.php" );
include( "../xhr/configure-mysql.php" );
$mysql = new cfgMySQL();
$mysql->Open();

echo "<dl>\n";
foreach ( $json_activities as $idx_a => $activity ) {
	$sql_id_activity += 1;
	
	echo "<dt style='font-weight:bold;margin-bottom:10px;'>";
	echo $idx_a . " : " . $activity['category'] . " / " . $activity['subcategory'] . " &raquo; " . $activity['name'];
	echo "</dt>\n";
	
	$query = "SELECT id FROM tbl_categoria WHERE chave = ";
	$query .= "'" . $activity['category'] . "'";
	$id_c = $mysql->Query( $query, MYSQL_SCALAR);
	$query = "SELECT id FROM tbl_subcategoria WHERE chave = ";
	$query .= "'" . $activity['subcategory'] . "'";
	$id_s = $mysql->Query( $query, MYSQL_SCALAR);
	
	echo "<dd>";
	echo "cat: " . $id_c . ", s: " . $id_s;
	echo "</dd>";
	
	
	$color = ($activity['status'] == "ok" ? "green" : "crimson");
	echo "<dd style='color:$color'>";
	echo $activity['status'] . " - " . $activity['file'];
	echo "</dd>";
	
	$levels = explode("/", $activity['levels']);
	echo "<dd>";
	echo $levels[0] . " / " . $levels[1];
	echo "</dd>";
	
	echo "<dd>";
	echo $activity['school'];
	echo "</dd>";
	
	if ( SAVE_ACT ) {
		$id_categoria = $mysql->InsertNewMultiple(
			"tbl_atividade",
			array(
				"nome",
				"ficheiro",
				"descricao",
				"level_max",
				"escolaridade",
				"status",
				"ref_categoria",
				"ref_subcategoria",
				"task"
			),
			array(
				$activity['name'],
				$activity['file'],
				"Cha la la...",
				(int)$levels[0],
				(int)$activity['school'],
				($activity['status'] == "ok" ? 0 : 1),
				(int)$id_c,
				(int)$id_s,
				$activity['task']
			)
		);
	}

}
echo "</dl>\n";

echo "<pre>";
print_r( $json_activities );
echo "</pre>";

?>