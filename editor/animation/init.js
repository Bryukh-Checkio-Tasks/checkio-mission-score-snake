//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });


        ext.set_animate_success_slide(function (this_e, options) {
            var ends = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

            options = options || {};
            var is_new_record = options.is_new_record || false;
            var place_rating = String(options.place_rating || 0);
            var best_points = options.best_points || 0;
            var current_points = options.current_points || 0;
            var $div = $("<div></div>");
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div class="result"></div></div>'));
            var $resultDiv = $h.find(".result");
            var $table = $("<table></table>").addClass("numbers");
            if (is_new_record) {
                $resultDiv.addClass("win-sign");
                $resultDiv.append($("<div></div>").text("You beat your best results!"));
                var $tr = $("<tr></tr>");
                $tr.append($("<th></th>").text(best_points));
                $tr.append($("<th></th>").text(place_rating).append($("<span></span>").addClass(".ends").text(ends[Number(place_rating[place_rating.length - 1])])));

                $table.append($tr);
                $tr = $("<tr></tr>");
                $tr.append($("<td></td>").text("Personal best"));
                $tr.append($("<td></td>").text("Place"));
                $table.append($tr);
            }
            else {
                $resultDiv.addClass("norm-sign");
                $resultDiv.append($("<div></div>").text("Your results"));
                $tr = $("<tr></tr>");
                $tr.append($("<th></th>").text(current_points));
                $tr.append($("<th></th>").text(best_points));
                $tr.append($("<th></th>").text(place_rating).append($("<span></span>").addClass(".ends").text(ends[Number(place_rating[place_rating.length - 1])])));

                $table.append($tr);
                $tr = $("<tr></tr>");
                $tr.append($("<td></td>").text("Points"));
                $tr.append($("<td></td>").text("Personal best"));
                $tr.append($("<td></td>").text("Place"));
                $table.append($tr);
            }
            $resultDiv.append($table);
            this_e.setAnimationHeight(255);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'move_snake';

            var checkioInput = data.in;
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput) + ')';

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');


            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_addon = data.ext["result_addon"];
                var route = data.ext["route"];

                var canvas = new SnakeCanvas();
                canvas.createCanvas($content.find(".explanation")[0], checkioInput);
                canvas.animateCanvas(route);

                //if you need additional info from tests (if exists)
                var explanation = data.ext["explanation"];
                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));
                if (!result) {
                    $content.find('.answer').html(result_addon);
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });


        function SVG(dom) {
            var colorOrange4 = "#a83901";
            var colorOrange3 = "#ca4701";
            var colorOrange2 = "#fa5e09";
            var colorOrange1 = "#Ff935b";

            var colorBlue4 = "#115d81";
            var colorBlue3 = "#2b95c5";
            var colorBlue2 = "#9ad0ec";
            var colorBlue1 = "#dceaf1";

            var colorGrey4 = "#000000";
            var colorGrey3 = "#373737";
            var colorGrey2 = "#7e7e7e";
            var colorGrey1 = "#cecece";

            var colorWhite = "#FFFFFF";

            var paper;

            this.draw = function() {};

            this.animate = function(){};
        }

        function SnakeCanvas() {
            var format = Raphael.format;

            var colorOrange4 = "#a83901";
            var colorOrange3 = "#ca4701";
            var colorOrange2 = "#fa5e09";
            var colorOrange1 = "#Ff935b";

            var colorBlue4 = "#115d81";
            var colorBlue3 = "#2b95c5";
            var colorBlue2 = "#9ad0ec";
            var colorBlue1 = "#dceaf1";

            var colorGrey4 = "#000000";
            var colorGrey3 = "#373737";
            var colorGrey2 = "#7e7e7e";
            var colorGrey1 = "#cecece";

            var colorWhite = "#FFFFFF";

            var colorDark = colorBlue4;
            var colorAlmostDark = colorBlue3;
            var colorOrange = colorOrange3;
            var colorBlue = colorBlue2;
            var colorLightBlue = colorBlue1;
            var colorWhite = "#FFFFFF";

            var delay = 300;
            var stepDelay = delay * 1.1;

            var zx = 30;
            var cellN = 10;
            var cellSize = 30;
            var fullSize = zx * 2 + cellN * cellSize;

            var attrOuter = {"stroke-width": 2, "stroke": colorDark};
            var attrInner = {"stroke-width": 1, "stroke": colorBlue};
            var attrTree = {"stroke-width": 1, "stroke": colorDark, "fill": colorDark};
            var attrCherry = {"stroke": colorOrange, "fill": colorOrange};
            var attrSnake = {"stroke": colorAlmostDark, "stroke-width": 13,
                "stroke-linecap": "round", "stroke-linejoin": "round",
                "arrow-end": "diamond-narrow-short"};

            var paper;
            var cellSet;
            var TREE = "M5,13 L15,2 L25,13 L22,14 L28,22 L19,23 L19,28 L11,28 L11,23 L2,22 L8,14 z";
            var snake = [];
            var canvasSnake;
            var gMap;

            function snakePath(sn) {
                var tail = sn.length - 1;
                var p = format("M{0},{1}",
                    sn[tail][1] * cellSize + zx + cellSize / 2,
                    sn[tail][0] * cellSize + zx + cellSize / 2
                );
                for (var i = tail - 1; i >= 0; i--) {
                    p += format("L{0},{1}",
                        sn[i][1] * cellSize + zx + cellSize / 2,
                        sn[i][0] * cellSize + zx + cellSize / 2
                    );
                }
//                p += "Z";
                return p;
            }


            this.createCanvas = function (dom, map) {
                gMap = map;
                paper = Raphael(dom, fullSize, fullSize, 0, 0);
                cellSet = paper.set();
                paper.rect(zx, zx, cellSize * cellN, cellSize * cellN).attr(attrOuter);
                for (var i = 1; i < cellN; i++) {
                    paper.path(Raphael.format("M{0},{2}L{1},{2}Z",
                        zx, zx + cellSize * cellN, zx + cellSize * i
                    )).attr(attrInner);
                    paper.path(Raphael.format("M{0},{1}L{0},{2}Z",
                        zx + cellSize * i, zx, zx + cellSize * cellN
                    )).attr(attrInner);
                }
                for (i = 0; i < map.length; i++) {
                    for (var j = 0; j < map[0].length; j++) {
                        if (map[i][j] === 'T') {
                            cellSet[i * cellN + j] = paper.path(TREE).transform(
                                "t" + (zx + cellSize * j) + "," +
                                    (zx + cellSize * i)).attr(attrTree);
                        }
                        else if (map[i][j] === 'C') {
                            cellSet[i * cellN + j] = paper.circle(
                                zx + cellSize * j + cellSize / 2,
                                zx + cellSize * i + cellSize / 2,
                                cellSize / 2 - 6
                            ).attr(attrCherry);
                        }
                        else if (parseInt(map[i][j]) === 0) {
                            snake[0] = [i, j];
                        }
                        else if (parseInt(map[i][j])) {
                            snake[parseInt(map[i][j])] = [i, j];
                        }
                    }
                }
                canvasSnake = paper.path(snakePath(snake)).attr(attrSnake);
            };

            this.animateCanvas = function (route) {
                for (var i = 0; i < route.length; i++) {
                    var act = route[i];
                    var head = snake[0];
                    var dir = [head[0] - snake[1][0], head[1] - snake[1][1]];
                    var nHead;
                    if (act == 'F') {
                        nHead = [head[0] + dir[0], head[1] + dir[1]];
                    }
                    else if (act == 'L') {
                        nHead = [head[0] - dir[1], head[1] + dir[0]];
                    }
                    else if (act == 'R') {
                        nHead = [head[0] + dir[1], head[1] - dir[0]];
                    }
                    var nSnake = [];
                    for (var j = 0; j < snake.length - 1; j++) {
                        nSnake.push(snake[j]);
                    }
                    var nSnakeShortPath = (snakePath(nSnake));
                    nSnake.unshift(nHead);
                    if (nHead[0] >=0 && nHead[1] < cellN &&
                            nHead[1] >=0 && nHead[1] < cellN &&
                            gMap[nHead[0]][nHead[1]] === "C"){
                        nSnake.push(snake[j]);
                    }
                    var nSnakePath = (snakePath(nSnake));
                    setTimeout(function(){
                        var tempHead = nHead.slice(0, nHead.length);
                        var spath = nSnakePath;
                        var sShortPath = nSnakeShortPath;
                        return function() {
                            canvasSnake.animate({"path": sShortPath},
                                delay/2,
                                function() {
                                    canvasSnake.animate({"path": spath},
                                        delay/3)
                                }
                            );
                            if (gMap[tempHead[0]][tempHead[1]] === "C") {
                                var ch = cellSet[tempHead[0] * cellN + tempHead[1]];
                                ch.animate({"r": 0}, delay, callback=function() {
                                    ch.remove();
                                });
                            }
                            if (gMap[tempHead[0]][tempHead[1]] === "T") {
                                var t = cellSet[tempHead[0] * cellN + tempHead[1]];
                                t.toFront();
                                t.animate({"fill": colorOrange}, delay);
                            }
                        }
                    }(), stepDelay * i + delay);
                    snake = nSnake;
                }
            };
        }


    }
);
