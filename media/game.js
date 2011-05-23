
var Game = function (init) {

    this.grid = [];
    this.running = false;

    for (var cell in init) {
        var cell = this.create(init[cell][0], init[cell][1]);
        this.add(cell);
    }
};

Game.prototype.create = function (x, y) {

    var cell = $('<div class="cell" />');
    //cell.text(x + '-' + y);
    cell.css('left', x * 50);
    cell.css('top', y * 50);
    cell.data('x', x);
    cell.data('y', y);

    $('body').append(cell);

    return cell;
};

Game.prototype.add = function (cell) {

    if (!(cell.data('x') in this.grid)) {
        this.grid[cell.data('x')] = [];
    }
    this.grid[cell.data('x')][cell.data('y')] = cell;
};

Game.prototype.click = function (e) {

	if (this.running) {
		return;
	}

	var x = Math.floor(e.pageX / 50);
	var y = Math.floor(e.pageY / 50);

    if (typeof this.grid[x] != 'undefined' && typeof this.grid[x][y] != 'undefined') {

    	this.kill(x, y);
        delete this.grid[x][y];

    } else {

		var cell = this.create(x, y);
		this.add(cell);    	
    }
}

Game.prototype.kill = function (x, y) {

    var cell = this.grid[x][y]
    cell.remove();
};

Game.prototype.envolve = function () {

    this.running = true;

    var cells = [];
    var kills = [];

    var max_x = 0;
    var min_x = 0;
    var max_y = 0;
    var min_y = 0;
    for (var x in this.grid) {
        if (x > max_x) {
            max_x = x;
        }
        if (x < min_x) {
            min_x = x;
        }
        for (var y in this.grid[x]) {
            if (y > max_y) {
                max_y = y;
            }
            if (y < min_y) {
                min_y = y;
            }
        }
    }

    for (var x = min_x; x <= max_x + 1; x++) {
        for (var y = min_y; y <= max_y + 1; y++) {

            var neighbors = -1;

            for (var a = x - 1; a <= x + 1; a++) {
                for (var b = y - 1; b <= y + 1; b++) {

                    if (typeof this.grid[a] != 'undefined' && typeof this.grid[a][b] != 'undefined') {
                        neighbors++;
                    }
                }
            }

            if (typeof this.grid[x] != 'undefined' && typeof this.grid[x][y] != 'undefined') {

                if (neighbors < 2 || neighbors > 3) {

                    this.kill(x, y);
                    kills[kills.length] = [x, y]
                }

            } else {
                if (neighbors == 2) {

                    cells[cells.length] = this.create(x, y);
                }
            }
        }
    }

    for (var i in cells) {

        this.add(cells[i]);
    }

    for (var i in kills) {

        var cell = kills[i];
        delete this.grid[cell[0]][cell[1]];
    }

    setTimeout(function (that) {
        that.envolve();
    }, 300, this);
};

Game.prototype.start = function () {
    
    setTimeout(function (that) {
        that.envolve();
    }, 1000, this);
};

Array.max = function(array){
    var max = 0;
    for (var i in array) {
        if (i > max) {
            max = i;
        }
    }
    return max;
};

Array.min = function(array){
    var min = 0;
    for (var i in array) {
        if (i < min) {
            min = i;
        }
    }
    return min;
};

