'use strict';

$we.register('fruitget', ['/bower_components/underscore/underscore.js', '/bower_components/jquery/dist/jquery.min.js', '/widgets/example2/css/banana.css'], function (widgets) {

  var templateUrl = '/widgets/example2/templates/fruits.tpl';
  var fruits = widgets;

  var FruitWidget = function FruitWidget(el) {

    this.el = el;
    this.$el = $(this.el);

  };

  FruitWidget.prototype = {

    initialize: function () {

      this.events();
      this.render();

    },

    events: function () {

      this.$el.on('click', '.js-reco-btn', $.proxy(this.pickFood, this));
      this.$el.on('click', '.js-btn', $.proxy(this.shuffleAndRender, this));

    },

    render: function () {

      var _this = this;
      var markup;

      $we.loadFile(this.$el.attr('data-widget-data-src'), function(data) {

        _this.data = JSON.parse(data);

        $we.loadFile(templateUrl, function(template) {

          _this.$el.html(template);

          markup = _this.$el.find('#header-tpl').html();
          _this.$el.find('#header').html(_.template(markup, { title: _this.$el.attr('data-widget-title') } ));

        });

      });

    },

    shuffleAndRender: function () {

      var shuffledData = _.shuffle(this.data);
      var markup = this.$el.find('#foods-tpl').html();

      this.$el.find('#foods').html(_.template(markup, { foods: shuffledData } ));

    },

    pickFood: function () {

        var favoIndex = _.random(0, this.data.length - 1);
        var favoFood = this.data[favoIndex];

        alert('the pick is: ' + favoFood);

    }

  };

  _.each(fruits, function (fruit) {

    console.log(fruit);

    new FruitWidget(fruit).initialize();

  });





});
