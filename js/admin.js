// Alpine store for toast messages
 document.addEventListener('alpine:init', () => {
   Alpine.store('toast', {
     open: false,
     msg: '',
     type: 'success',
     show(message, type='success') {
       this.msg = message;
       this.type = type === 'error' ? 'error' : 'success';
       this.open = true;
       setTimeout(() => this.open = false, 3000);
     }
   });
 });

 document.addEventListener('htmx:afterRequest', (e) => {
   if (e.detail.xhr.status >= 200 && e.detail.xhr.status < 300) {
     Alpine.store('toast').show('Saved!', 'success');
   } else {
     Alpine.store('toast').show('Request failed', 'error');
   }
 });
 document.addEventListener('htmx:responseError', () => {
   Alpine.store('toast').show('Request failed', 'error');
 });