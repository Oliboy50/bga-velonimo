{OVERALL_GAME_HEADER}

<div id="board"></div>

<div id="my-hand-wrapper" class="whiteblock">
    <h3>{MY_HAND}</h3>
    <div id="my-hand"></div>
</div>

<script type="text/javascript">
    var jstpl_player_table = `<div id="player-table-\${id}" class="player-table" style="\${tableStyle}">
    <div id="player-table-\${id}-name" class="player-table-name" style="color:#\${color}">\${name}</div>
    <div id="player-table-\${id}-hand" class="player-table-hand"><span id="player-table-\${id}-number-of-cards" class="number-of-cards">\${numberOfCardsInHand}</span></div>
    <div id="player-table-\${id}-cards" class="player-table-cards" style="\${cardsStyle}"></div>
</div>`;

    var jstpl_cards_stack = '<div id="cards-stack-${id}" class="cards-stack" style="width: ${width}px;"></div>';
    var jstpl_card_in_stack = '<div id="card-in-stack-${id}" class="card-in-stack" style="background-position: -${x}px -${y}px;"></div>';
</script>

{OVERALL_GAME_FOOTER}
