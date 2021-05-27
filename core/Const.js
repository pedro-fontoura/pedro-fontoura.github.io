"use strict";

console.assert( typeof Lema == "function" );

//Lema metadata
Lema.TIMESTAMP = "201711";
Lema.NAME = "LEMA";
Lema.VERSION = "0.3";

Lema.activityPath = "activities/";
Lema.audioPath = "data/audio/";
Lema.videoPath = "data/video/";
Lema.imagePath = "data/image/";
Lema.iconPath = "data/icons/";

Lema.FontFamily = "Arial";

// Configuration Constants
Lema.Const = {
	MIN_ACTIVITIES: 5,
	MAX_ACTIVITIES: 10,
	LEVEL_MIN: 1,
	LEVEL_MAX: 5,
	LEVEL_NR: 5,
	ATTEMPTS_MAX: 3,
	APP_STAT_INIT: 0,
	APP_STAT_CURRENT: 1,
	APP_STAT_SUCCESS: 2,
	APP_STAT_FAIL: 3,
	APP_STAT_TXT: [
		"&#x25CE;",	// init
		"&#x25CE;", // current
		"&#x2714;",	// success
		"&#x2718;"	// fail
	],
	BTN_TEXT_SCALE: 0.55,
	BTN_ICON_SCALE: 0.90,
	BTN_BORDER_RADIUS: 0.20,
};

Lema.Const.Text = {
	MAIN_TITLE : "Ambiente Digital de Aprendizagem Matem&aacute;tica para crian&ccedil;as com PEA (v3).",
	NO_ACTIVITIES : "Sem atividades.",
	NO_SELECTED_ACTIVITIES : "Sem desafios selecionados.",
	LIST_SELECTED_ACTIVITIES : "Lista de desafios selecionados"
};

Lema.Const.Feedback = {
	END_1: "Parab&eacute;ns!",
	END_1_MSG: "Respondeste a todos os desafios.",
	SUCCESS_1: "Boa! Ganhaste!",
	SUCCESS_2: "Bravo! Continua!",
	SUCCESS_3: "Boa!",
	FAIL_1: "N&atilde;o est&aacute; bem!",
	FAIL_1_MSG: "Tenta de novo!",
	FAIL_2: "N&atilde;o est&aacute; bem!",
	FAIL_2_MSG: "Tenta outra vez!",
	FAIL_3: "N&atilde;o est&aacute; certo!",
	FAIL_3_MSG: "Queres passar ao pr&oacute;ximo desafio?",
	
	BTN_BG_NORMAL: "#5b87c5",
	BTN_BG_OVER: "#666666",
	BTN_FG_NORMAL: "#FFF",
	BTN_FG_OVER: "#FFF",
	BTN_TEXT_SCALE: 0.28,
	BTN_ICON_SCALE: 1
};

Lema.Const.Dialog = {
	TXT_NO_COUNTNR: "Tens que escolher o n&uacute;mero de desafios que queres executar.",
	TXT_NO_CATEGORIES: "Tens que escolher os temas que queres fazer.",
	TXT_UNAVAILABLE_ACTIVITIES: "N&atilde;o h&aacute; desafios dispon&iacute;veis para a tua escolha.",
	TXT_NO_ACTIVITIES: "Tens que escolher pelo menos um desafio.",
	TXT_MAX_ACTIVITIES: "N&atilde;o podes escolher mais de " + Lema.Const.MAX_ACTIVITIES + " desafios.",
	TXT_BACK_TO_MENU : "Queres voltar ao menu?",
	TXT_LOGOUT: "Queres sair do LEMA?",
	TXT_LOGIN_EMAIL: "Tens que indicar o teu endere&ccedil;o de e-mail.",
	TXT_LOGIN_PASSWORD: "Tens que indicar a tua senha.",
	TXT_INPUT_FIELD: "Tens que preencher o campo: ",
	TXT_SEND_REQUEST: "A enviar o pedido...",
	TXT_LOGIN_ATHENTICATE: "A autenticar...",
	TXT_CLEAR_SELECTION: "Limpar a sele&ccedil;&atilde;o?",
	TXT_NO_STUDENT: "Tens que escolher um aluno.",
	TXT_SEQUENCE_CREATE: "A enviar a sequ&ecirc;ncia...",
	TXT_NO_INFO: "Sem informa&ccedil;&atilde;o.",
	TXT_REQUEST_PWD: "A enviar o pedido...",
	TXT_REQUEST_PWD_OK: "Senha enviada para o teu email.",
};

Lema.Const.Menu = {};

Lema.Const.Menu.Student = {
	BTN_TEXT_SCALE: 0.30,
	BTN_ICON_SCALE: 0.90,
	BTN_TOGGLE_OFF: "#5b87c5",
	BTN_TOGGLE_ON: "#B0502D", //"#e5ab47",
	BTN_TOGGLE_FG: "#FFF",
	BTN_SEQUENCE_FG: "white",
	BTN_SEQUENCE_BG: "DarkOrange",
	
	HEADER_1: "Escolhe novos desafios. Segue estes passos:",
	STEP_1: "Passo 1: Escolhe os temas que queres fazer.",
	STEP_2: "Passo 2: Escolhe o n&uacute;mero de desafios que queres executar.",
	HEADER_2: "O teu professor enviou-te atividades.",
	STEP_2a: "Clica no bot&atilde;o abaixo para as executares:",
};

Lema.Const.Layout = {
	TOP_BAR_HEIGHT: 0.18,
	TOP_BAR_HEIGHT2: 0.25
};

Lema.Colors = {
	OK_INPUT_BG: "#FFF",
	BAD_INPUT_BG: "rgba(255, 165, 0, 0.50)",
	TOPBAR_BG: "#5b87c5",
	TOPBAR_FG: "#FFFFFF",
	TOPBAR_INFO_BG: "#b5c8e5",
	TOPBAR_INFO_BG_ON: "#c3d3eb",
	TOPBAR_INFO_BG2: "#dfe7f4",
	TOPBAR_INFO_BG2_ON: "#eef3fa",
	TOPBAR_INFO_FG: "#5b87c5",
	
	TOPBAR_SEQUENCE_SUCCESS: "darkgreen",
	TOPBAR_SEQUENCE_FAIL: "crimson",
	
	ANCHOR_HOVER: "rgba(255, 255, 255, 0.50)",
	ANCHOR_BORDER_ON: "#B0502D", //"#5b87c5",
	ANCHOR_BORDER_OFF: "transparent",
	ANCHOR_BORDER_HOVER: "#5b87c5", //"#5b87c5",
	
	BTN_HOVER: "#7c7c7c",
	BTN_HOVER_FG: "white",
	BTN_DEFAULT_FG: "black",
	BTN_SHADOW: "#333",
	
	BTN_BACK: "#5b87c5",
	BTN_SUBMIT: "#6aa542",
	
	LIST_CATEGORY_FG: "#5b87c5",
	
	CARD_OFF: "#dfe7f4",
	CARD_ON: "#B0502D",
	CARD_TEXT: "#5b87c5",
	CARD_LEVEL_BG: "#CCCCFF",
	CARD_SHADOW: "#666666",
	CARD_THUMB_BG: "#999999",
	
	VEIL_BG: "black",
	VEIL_OPACITY: 0.66,
	DIALOG_BG: "white",
	DIALOG_B_OK: "#6aa542",
	DIALOG_B_NK: "crimson",
	DIALOG_FG: "#666", //"#5B87C5",
	DIALOG_SHADOW: "#333",
	
	FEEDBACK_TXT: "black",
	FEEDBACK_MSG: "black",
};
