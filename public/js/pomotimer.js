let countdown;
let pause = false;
let completedPomos = 0;
const pomoend = document.getElementById('pomoend');
const breakend = document.getElementById('breakend');

countdown2 = $('#countdown2').countdown360({
  radius: 60,
  seconds: 5 * 60,
  fontSize: 30,
  fillStyle: 'orange',
  strokeWidth: 4,
  fontColor: '#FFFFFF',
  autostart: false,
  smooth: true,
  onComplete() {
    breakend.play();
    countdown.start();
    $('#countdiv1').removeClass('hidden');
    $('#countdiv2').addClass('hidden');
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
      $('#countdiv1').addClass('hidden');
      $('#countdiv2').removeClass('hidden');
      pomoend.play();
      completedPomos++;
      $('#pomocounter').html(completedPomos + "/" + pomolen);
      if (pomolen > completedPomos) {
        countdown2.start();
      } else {
        console.log('pomo session finished!');
        $('#submitdata').click();
        location.reload(true);
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