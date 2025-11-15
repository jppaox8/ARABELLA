const { useState, useEffect } = React;

function Toast({ text, kind = 'success', onClose }){
  useEffect(()=>{
    if(!text) return;
    const t = setTimeout(onClose, 3200);
    return ()=> clearTimeout(t);
  },[text, onClose]);
  if(!text) return null;
  const bg = kind === 'error' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800';
  return (
    <div className={`fixed right-4 bottom-6 z-50 p-3 rounded shadow-sm border ${bg}`} role="status">
      {text}
    </div>
  );
}

function ContactCard(){
  const [form, setForm] = useState({ nombre:'', correo:'', pais:'', mensaje:'' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(''); // '', 'sending', 'sent', 'error'
  const [toast, setToast] = useState('');

  useEffect(()=>{
    if(status === 'sent'){
      setToast('Mensaje enviado. Te responderemos pronto.');
      const t = setTimeout(()=> setStatus(''), 2200);
      return ()=> clearTimeout(t);
    }
    if(status === 'error'){
      setToast('No se pudo enviar. Se abrirá tu cliente de correo.');
    }
  },[status]);

  const onChange = (k)=>(e)=> setForm({...form, [k]: e.target.value});

  const validate = ()=>{
    const e = {};
    if(!form.nombre.trim()) e.nombre = 'Requerido';
    if(!form.correo.trim()) e.correo = 'Requerido';
    else if(!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = 'Email inválido';
    if(!form.mensaje.trim()) e.mensaje = 'Escribe tu mensaje';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fallbackMail = ()=>{
    const body = `Nombre: ${form.nombre}\nEmail: ${form.correo}\nPais: ${form.pais}\n\n${form.mensaje}`;
    const href = `mailto:contacto@tutienda.com?subject=${encodeURIComponent('Consulta desde web')}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const submit = async (ev)=>{
    ev.preventDefault();
    setToast('');
    if(!validate()) return;
    setStatus('sending');
    try{
      // intenta enviar a endpoint (ajusta si tienes otro)
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      if(res.ok){
        setStatus('sent');
        setForm({ nombre:'', correo:'', pais:'', mensaje:'' });
        setErrors({});
      } else {
        setStatus('error');
        fallbackMail();
      }
    }catch(err){
      console.error(err);
      setStatus('error');
      fallbackMail();
    }
  };

  return (
    <div className="rc-wrapper max-w-5xl mx-auto p-6">
      <style>{`
        .rc-wrapper{display:flex;gap:22px;align-items:flex-start}
        .rc-form{flex:1;background:#fff;padding:18px;border-radius:12px;border:1px solid rgba(197,154,107,0.09);box-shadow:0 8px 20px rgba(161,129,99,0.06)}
        .rc-side{width:300px;min-width:220px;background:linear-gradient(180deg,#fffaf7,#fff3ea);padding:14px;border-radius:12px;border:1px solid rgba(197,154,107,0.08)}
        .rc-label{display:block;font-weight:600;color:#8a5e3a;margin-bottom:6px}
        .rc-input{width:100%;padding:10px;border-radius:8px;border:1px solid #eee;margin-bottom:10px}
        .rc-text{width:100%;min-height:110px;padding:10px;border-radius:8px;border:1px solid #eee}
        .rc-btn{background:#C59A6B;color:#fff;padding:10px 14px;border-radius:10px;border:none;font-weight:600}
        .rc-error{color:#b00020;font-size:13px;margin-top:4px}
        @media(max-width:900px){.rc-wrapper{flex-direction:column}.rc-side{width:100%}}
      `}</style>

      <form className="rc-form" onSubmit={submit} noValidate>
        <h3 style={{marginTop:0,color:'#8a5e3a'}}>Contáctanos</h3>
        <p style={{marginTop:6,marginBottom:12,color:'#6b6b6b'}}>Te ayudamos con talles, envíos y disponibilidad.</p>

        <label className="rc-label">Nombre</label>
        <input className="rc-input" value={form.nombre} onChange={onChange('nombre')} aria-label="Nombre" />
        {errors.nombre && <div className="rc-error">{errors.nombre}</div>}

        <label className="rc-label">Correo</label>
        <input className="rc-input" value={form.correo} onChange={onChange('correo')} type="email" aria-label="Correo" />
        {errors.correo && <div className="rc-error">{errors.correo}</div>}

        <label className="rc-label">País (opcional)</label>
        <input className="rc-input" value={form.pais} onChange={onChange('pais')} aria-label="Pais" />

        <label className="rc-label">Mensaje</label>
        <textarea className="rc-text" value={form.mensaje} onChange={onChange('mensaje')} aria-label="Mensaje" />
        {errors.mensaje && <div className="rc-error">{errors.mensaje}</div>}

        <div style={{marginTop:12,display:'flex',gap:10,alignItems:'center'}}>
          <button className="rc-btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando...' : 'Enviar'}</button>
          <button type="button" onClick={fallbackMail} style={{padding:'8px 12px',borderRadius:8,border:'1px solid #ddd',background:'#fff'}}>Enviar por email</button>
          {status === 'sent' && <span style={{color:'#8a5e3a',fontWeight:600}}>Enviado ✓</span>}
        </div>
      </form>

      <aside className="rc-side">
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:46,height:46,borderRadius:10,background:'#C59A6B',color:'#fff,',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>A</div>
          <div>
            <div style={{fontWeight:700,color:'#8a5e3a'}}>Arabella Chic</div>
            <div style={{fontSize:13,color:'#6b6b6b'}}>Tienda de calzado femenino</div>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontWeight:600,color:'#8a5e3a'}}>Dirección</div>
          <div style={{fontSize:13,color:'#444'}}>Calle Ejemplo 123, Ciudad</div>
        </div>

        <div style={{marginTop:10}}>
          <div style={{fontWeight:600,color:'#8a5e3a'}}>Horario</div>
          <div style={{fontSize:13,color:'#444'}}>Lun-Vie 9:00-18:00</div>
        </div>

        <div style={{marginTop:12}}>
          <iframe title="mapa" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7769.901094267319!2d-74.22460053410653!3d-13.165518104502462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91127d88f5b2bee9%3A0xe9b3cb843a70a16e!2sAyacucho!5e0!3m2!1ses-419!2spe!4v1763166756871!5m2!1ses-419!2spe" style={{width:'100%',height:160,border:0,borderRadius:8}} allowFullScreen loading="lazy"></iframe>
        </div>
      </aside>

      <Toast text={toast} kind={status === 'error' ? 'error' : 'success'} onClose={()=> setToast('')} />
    </div>
  );
}

// Montaje en #contacto
document.addEventListener('DOMContentLoaded', ()=>{
  const el = document.getElementById('contacto');
  if(!el) return console.warn('No existe el contenedor #contacto');
  try{
    ReactDOM.createRoot(el).render(React.createElement(ContactCard));
  }catch(e){
    // fallback (no debería lucir en tu entorno porque tienes React18)
    ReactDOM.render(React.createElement(ContactCard), el);
  }
});
