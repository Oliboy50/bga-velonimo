{OVERALL_GAME_HEADER}

<div id="board"></div>

<div id="myhand-wrapper" class="whiteblock">
    <h3>{MY_HAND}</h3>
    <div id="myhand"></div>
</div>

<script type="text/javascript">
    var jstpl_player_table = `<div id="player-table-\${id}" class="player-table player-table-\${position}" style="width:\${w}px; height:\${h}px; left:\${x}px; bottom:\${y}px;">
    <div id="player-table-\${id}-name" class="player-table-name" style="color:#\${color}">\${name}</div>
    <div id="player-table-\${id}-cards" class="player-table-cards"></div>
</div>`;

    var jstpl_cards_stack = '<div id="cards-stack-${id}" class="cards-stack"></div>';
    var jstpl_card_in_stack = '<div id="card-in-stack-${id}" class="card-in-stack card-${color}-${value}"></div>';
</script>

{OVERALL_GAME_FOOTER}
