let countdown;
let pause = false;
let completedPomos = 0;
countdown2 = $('#countdown2').countdown360({
  radius: 60,
  seconds: 5,
  fontSize: 30,
  fillStyle: 'orange',
  strokeWidth: 4,
  fontColor: '#FFFFFF',
  autostart: false,
  smooth: true,
  onComplete() {
    countdown.start();
  },
});

$('.startimer').click(() => {
  const pomolen = Number($('input.pomonum').val());
  const mysecs = $('input.seconds').val() * 60;
  countdown = $('#countdown').countdown360({
    radius: 60,
    seconds: mysecs,
    fontSize: 30,
    strokeWidth: 4,
    fontColor: '#FFFFFF',
    autostart: false,
    smooth: true,
    onComplete() {
      $('.startimer').removeClass('hidden');
      $('.restart').addClass('hidden');
      completedPomos++;
      if (pomolen > completedPomos) {
        countdown2.start();
      }
    },
  });
  $('.startimer').addClass('hidden');
  $('.restart').removeClass('hidden');

  countdown.start();
  let counter = 0;
  let interval;
  $('#countdown').click(() => {
    if (!pause) {
      countdown.stop();
      pause = true;
      interval = setInterval(() => {
        counter++;
      }, 1000);
    } else {
      countdown.addSeconds(counter + 1);
      pause = false;
      clearInterval(interval);
      counter = 0;
    }
  });
});
$('.restart').click(() => {
  pause = false;
  mysecs = $('input.seconds').val() * 60;
  countdown.start();
});
