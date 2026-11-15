(function(){
  var b=document.querySelector('.nav-toggle'),n=document.querySelector('.nav');
  if(b&&n){b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));n.classList.toggle('open',!o)});
    n.addEventListener('click',function(e){if(e.target.tagName==='A'){b.setAttribute('aria-expanded','false');n.classList.remove('open')}})}
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  document.documentElement.classList.add('js');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
})();
