// Generated by CoffeeScript 1.6.3
var MazeResultViewer, getHash,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

getHash = function() {
  if (window.location.hash.length > 0) {
    return parseInt(window.location.hash.replace('#', ''));
  } else {
    return 1;
  }
};

MazeResultViewer = (function() {
  function MazeResultViewer() {
    this.retry = __bind(this.retry, this);
    this.frontend = new Frontend();
    this.$result = null;
    this.desiredTipCount = [3, 1, 4, 3, 5];
  }

  MazeResultViewer.prototype.end = function(result) {
    $('#stop').attr('disabled', 'disabled');
    $('.question-number').attr('disabled', 'disabled');
    this.disableInput();
    return this.showResult(result);
  };

  MazeResultViewer.prototype.createResultView = function(playerCount, desiredCount) {
    var $enemyResult, $label, $playerResult, $result, _createResultView,
      _this = this;
    $result = $('<div></div>').attr('id', 'battle-result');
    $playerResult = $('<div></div>').attr('id', 'player-result');
    $enemyResult = $('<div></div>').attr('id', 'enemy-result');
    _createResultView = function($parent) {
      var $clearText, $desiredCountText, $playerCountText, $warnCountText, cls;
      cls = playerCount > desiredCount ? 'text-danger' : 'text-success';
      $clearText = $('<div></div>').attr('class', 'result-text clear text-success').text('クリア！');
      $playerCountText = $('<div></div>').attr('class', 'result-text player-count ' + cls).text('利用したチップ数: ' + playerCount);
      $desiredCountText = $('<div></div>').attr('class', 'result-text desired-count text-primary').text('目標のチップ数: ' + desiredCount);
      $warnCountText = $('<div></div>').attr('class', 'result-text warn-text text-warning').text('チップ数には動作命令と分岐命令のみ含まれます。');
      $parent.append($clearText);
      $parent.append($desiredCountText);
      $parent.append($playerCountText);
      return $parent.append($warnCountText);
    };
    _createResultView($result);
    $label = $('<div></div>').attr('class', 'result-label');
    $result.append(this.createResultButton());
    return $result;
  };

  MazeResultViewer.prototype.retry = function() {
    var _this = this;
    return $('#battle-result').fadeOut('fast', function() {
      $('#battle-result').remove();
      return $('#enchant-stage').fadeIn('fast', function() {
        $('#filter').remove();
        _this.hideResult();
        $('#stop').click();
        return $('.question-number').removeAttr('disabled');
      });
    });
  };

  MazeResultViewer.prototype.createResultButton = function() {
    var $backButton, $buttons, $nextButton, $retryButton, page,
      _this = this;
    page = window.location.hash.length > 0 ? parseInt(window.location.hash.replace('#', '')) : 1;
    $backButton = $('<a></a>').attr({
      id: 'back-btn',
      "class": 'btn btn-lg btn-danger result-btn'
    }).text('Back');
    $retryButton = $('<div></div>').attr({
      id: 'retry-btn',
      "class": 'btn btn-lg btn-primary result-btn'
    }).text('Retry').click(this.retry);
    $nextButton = $('<a></a>').attr({
      id: 'next-btn',
      "class": 'btn btn-lg btn-success result-btn'
    }).text('Next');
    $backButton.click(function() {
      window.location.href = window.location.pathname + '#' + (page - 1);
      return _this.retry();
    });
    $nextButton.click(function() {
      window.location.href = window.location.pathname + '#' + (page + 1);
      return _this.retry();
    });
    $buttons = $('<div></div>').attr('class', 'result-btns');
    console.log(page);
    if (page > 1) {
      $buttons.append($backButton);
    }
    $buttons.append($retryButton);
    if (page < 5) {
      $buttons.append($nextButton);
    }
    return $buttons;
  };

  MazeResultViewer.prototype.showResult = function(count) {
    var _this = this;
    this.$result = this.createResultView(count.action + count.branch, this.desiredTipCount[getHash() - 1]);
    return $('#enchant-stage').fadeOut('fast', function() {
      $(_this).remove();
      return $('#program-container').append(_this.$result);
    });
  };

  MazeResultViewer.prototype.hideResult = function() {
    if (this.$result != null) {
      this.$result.remove();
      return this.$result = null;
    }
  };

  MazeResultViewer.prototype.disableInput = function() {
    var $filter;
    $filter = $('<div></div>').attr('id', 'filter');
    return $('#program-container').append($filter);
  };

  return MazeResultViewer;

})();

$(function() {
  var highlitePagerButton, page;
  page = window.location.hash.length > 0 ? parseInt(window.location.hash.replace('#', '')) : 1;
  $('.question-number').click(function() {
    return window.location.href = window.location.pathname + '#' + $(this).text();
  });
  $('.question-number').removeAttr('disabled');
  highlitePagerButton = function(num) {
    var $btn, $pager, btn, i, _i, _len, _results;
    $pager = $('.question-number');
    _results = [];
    for (i = _i = 0, _len = $pager.length; _i < _len; i = ++_i) {
      btn = $pager[i];
      $btn = $(btn);
      $btn.removeClass('btn-default');
      $btn.removeClass('btn-primary');
      $btn.removeAttr('disabled');
      if (i === (num - 1)) {
        $btn.addClass('btn-primary');
        _results.push($btn.attr('disabled', 'disabled'));
      } else {
        _results.push($btn.addClass('btn-default'));
      }
    }
    return _results;
  };
  highlitePagerButton(page);
  tm.HashObserver.enable();
  return document.addEventListener("changehash", function(e) {
    $('#filter').remove();
    return highlitePagerButton(e.hash.replace('#', ''));
  });
});
