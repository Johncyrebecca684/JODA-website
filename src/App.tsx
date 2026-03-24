import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Package, Check, ArrowRight, Instagram, Mail, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const products = [
  { size: "A5", priceWithFrame: "₹350", priceWithoutFrame: "₹150", delivery: "4-5 Days", img: "/WhatsApp Image 2026-03-19 at 9.09.11 AM.jpeg" },
  { size: "A4", priceWithFrame: "₹500", priceWithoutFrame: "₹250", delivery: "5-7 Days", img: "/WhatsApp Image 2026-03-19 at 9.08.27 AM.jpeg" },
  { size: "A3", priceWithFrame: "₹1000", priceWithoutFrame: "₹550", delivery: "7-10 Days", img: "/WhatsApp Image 2026-03-19 at 9.08.51 AM.jpeg" }
];

const gallery = [
  "/WhatsApp Image 2026-03-18 at 2.34.03 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.35.17 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.35.19 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.35.52 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.36.08 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.36.18 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.36.38 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.36.39 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.36.47 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.37.30 PM.jpeg",
  "/WhatsApp Image 2026-03-18 at 2.37.32 PM.jpeg"
];

const testimonials = [
  { text: "I ordered an A3 portrait of my parents. When they saw it, they burst into tears. The level of detail and emotion captured is just unbelievable.", author: "Tamil Selvi" },
  { text: "The premium feel isn't just in the packaging but in every stroke of the pencil. Worth every penny.", author: "Kamini" },
  { text: "Absolutely stunning. I couldn't believe it was hand-drawn until I saw the subtle graphite textures up close.", author: "Martin David" }
];

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(true);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', size: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    
    // Generate a random Order ID
    const orderId = `JODA-${Math.floor(10000 + Math.random() * 90000)}`;

    // Parse the size and price properly
    let selectedSizeLabel = formData.size;
    let priceItem = "";
    
    if (formData.size) {
      const [sizeStr] = formData.size.split('-');
      const isWithFrame = formData.size.includes('with-frame');
      const prod = products.find(p => p.size === sizeStr);
      
      if (prod) {
        selectedSizeLabel = `${sizeStr} Portrait (${isWithFrame ? 'With Frame' : 'Without Frame'})`;
        priceItem = isWithFrame ? prod.priceWithFrame : prod.priceWithoutFrame;
      }
    }

    // Parameters expected by your templates
    const templateParams = {
      order_id: orderId,
      client_name: formData.name,
      email: formData.email, // your forms use this for the recipient
      selected_size: selectedSizeLabel,
      price: priceItem,
      cost: {
        total: priceItem,
        shipping: "₹50",
        tax: "Included in price"
      },
      additional_notes: formData.notes,
      reference_photo: selectedFile ? selectedFile.name : "No photo attached"
    };
    
    // Send Confirmation to Client (template_h9yu5vt)
    const sendClientEmail = emailjs.send('service_bkkqbgq', 'template_h9yu5vt', templateParams, 'IhHKCGQTyJL_jY-w6');
    
    // Send Notification to Business (template_6u9wyxh)
    const sendBusinessEmail = emailjs.send('service_bkkqbgq', 'template_6u9wyxh', templateParams, 'IhHKCGQTyJL_jY-w6');

    Promise.all([sendClientEmail, sendBusinessEmail])
      .then(() => {
          alert('Order placed successfully! We have sent a confirmation email to you.');
          setFormData({ name: '', email: '', size: '', notes: '' });
          setSelectedFile(null);
      })
      .catch((error: any) => {
          console.error(error);
          alert('Failed to send! Please ensure your EmailJS configuration is correct.');
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const handleMouseOver = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener("mouseover", handleMouseOver);
    
    setTimeout(() => setLoading(false), 2500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--color-lavender-light)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ width: '80px', height: '80px', border: '2px solid var(--color-text-dark)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1.5s linear infinite' }}
        />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginTop: '2rem', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontStyle: 'italic' }}
        >
          Drawing your experience...
        </motion.p>
      </div>
    );
  }

  return (
    <>
      <div 
        className={"custom-cursor " + (isHovering ? "hovering" : "")} 
        style={{ left: mousePosition.x + "px", top: mousePosition.y + "px" }} 
      />
      
      {/* Navigation */}
      <nav className="main-nav">
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>JODA Arts.</h2>
        <div className="nav-links">
          <a href="#how-it-works" style={{ fontWeight: 500, transition: '0.3s' }}>Process</a>
          <a href="#gallery" style={{ fontWeight: 500, transition: '0.3s' }}>Gallery</a>
          <button className="btn-primary" style={{ padding: '0.8rem 1.5rem' }} onClick={() => document.getElementById('order')?.scrollIntoView()}>
            Order Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section hero-section">
        <div className="grid-2 align-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            <h1 style={{ marginBottom: '1.5rem' }}>Your Memories, <br/><span style={{ fontStyle: 'italic', position: 'relative' }}>Hand-Drawn Forever.
              <svg width="100%" height="20" style={{ position: 'absolute', bottom: -10, left: 0 }} viewBox="0 0 400 20" preserveAspectRatio="none">
                <motion.path 
                  d="M5 15Q100 5 200 10T395 5" 
                  fill="none" 
                  stroke="var(--color-lavender-dark)" 
                  strokeWidth="3" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
            </span></h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '80%' }}>Custom black & white portrait drawings. A premium art piece crafted with profound attention to emotional detail.</p>
            <div className="flex-row-wrap">
              <button className="btn-primary" onClick={() => document.getElementById('order')?.scrollIntoView()}>
                Order Your Portrait
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('gallery')?.scrollIntoView()}>
                View Styles
              </button>
            </div>
          </motion.div>
          <motion.div 
            className="hero-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-hover)' }}
          >
            <img className="hero-img" src="/WhatsApp Image 2026-03-16 at 8.42.58 PM.jpeg" alt="Hero Art" style={{ width: '100%', filter: 'grayscale(100%) contrast(1.2)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="section" style={{ background: 'var(--color-white)', borderRadius: '48px 48px 0 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2>The Artistic Process</h2>
          <p style={{ marginTop: '1rem' }}>Four steps from your memory to a masterpiece.</p>
        </div>
        
        <div className="grid-4">
          {[
            { icon: Camera, title: "Upload Photo", desc: "Share your high-resolution memory." },
            { icon: Package, title: "Choose Size", desc: "Select from A5 to A3 format." },
            { icon: User, title: "Artist Draws", desc: "Hand-drawn with precision and love." },
            { icon: Check, title: "Delivered to You", desc: "Safely packaged & shipped worldwide." }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              style={{ textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-lavender-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <step.icon size={32} color="var(--color-text-dark)" />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.8rem' }}>{step.title}</h3>
              <p style={{ fontSize: '0.95rem' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section className="section">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2>Portrait Sizes & Pricing</h2>
          <p style={{ marginTop: '1rem' }}>Priced reflecting hours of dedicated craftsmanship.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
          {products.map((p, i) => (
            <motion.div 
              key={i}
              className="glass-panel"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              style={{ overflow: 'hidden', padding: '1rem', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ width: '100%', height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.02)' }}>
                <img src={p.img} alt={p.size} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%)' }} />
              </div>
              <div style={{ padding: '0 1rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>{p.size} Portrait</h3>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{p.priceWithoutFrame} <span style={{fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.8}}>w/o frame</span></div>
                    <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-lavender-dark)' }}>{p.priceWithFrame} <span style={{fontSize: '0.8rem', fontWeight: 'normal', opacity: 0.8}}>with frame</span></div>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16}/> Delivery: {p.delivery}</p>
                <button className="btn-secondary" style={{ width: '100%' }} onClick={() => document.getElementById('order')?.scrollIntoView()}>
                  Select Size
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Before / After Slider */}
      <section className="section" style={{ background: 'var(--color-lavender-base)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>The Transformation</h2>
          <p style={{ marginTop: '1rem' }}>See how a simple photo becomes a timeless masterpiece.</p>
        </div>
        
        <div 
          ref={containerRef}
          onMouseMove={(e) => handleSliderMove(e.clientX)}
          onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            aspectRatio: '16/10',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-hover)',
            cursor: 'ew-resize'
          }}
          className="glass-panel"
        >
          <img 
            src="/WhatsApp Image 2026-03-18 at 3.06.19 PM.jpeg" 
            alt="Original Photo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0, background: 'rgba(0,0,0,0.02)' }}
          />
          
          <img 
            src="/WhatsApp Image 2026-03-18 at 3.07.41 PM.jpeg" 
            alt="Pencil Sketch" 
            style={{ 
              width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0,
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
            }}
          />

          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: sliderPosition + "%",
            width: '3px',
            background: 'var(--color-white)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: sliderPosition + "%",
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            background: 'var(--color-white)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none'
          }}>
            <div style={{ width: '20px', height: '2px', background: 'var(--color-text-dark)' }}></div>
          </div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order" className="section" style={{ background: 'var(--color-text-dark)', color: 'var(--color-white)', borderRadius: '48px' }}>
        <div className="grid-2">
          <div>
            <h2 style={{ color: 'var(--color-white)', marginBottom: '1.5rem' }}>Ready to immortalize your memory?</h2>
            <p style={{ color: 'var(--color-lavender-dark)', fontSize: '1.1rem', marginBottom: '3rem' }}>
              Fill out the form to place your custom order. Ensure your photo is high-resolution for the best hand-drawn result.
            </p>
            
            <div style={{ borderLeft: '2px solid var(--color-lavender-dark)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div>
                 <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-white)' }}>1. High Quality Photo</h4>
                 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>Clear lighting, visible facial features.</p>
               </div>
               <div>
                 <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-white)' }}>2. Deposit</h4>
                 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>A 50% deposit secures your spot.</p>
               </div>
            </div>
          </div>
          
          <motion.form 
            ref={formRef as any}
            className="glass-panel order-form-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            onSubmit={handleOrderSubmit}
          >
            <h3 style={{ color: 'var(--color-white)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Order Details</h3>
            
            <div className="form-grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-lavender-dark)' }}>Your Name</label>
                <input required name="name" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'var(--color-white)', fontFamily: 'var(--font-body)', outline: 'none' }} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-lavender-dark)' }}>Email Address</label>
                <input required name="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'var(--color-white)', fontFamily: 'var(--font-body)', outline: 'none' }} placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-lavender-dark)' }}>Select Size</label>
              <select required name="size" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'var(--color-white)', fontFamily: 'var(--font-body)', outline: 'none' }}>
                <option value="" disabled>Choose a size & framing option</option>
                {products.map(p => (
                  <optgroup label={`${p.size} Portrait`} key={p.size}>
                    <option value={`${p.size}-no-frame`}>{p.size} (Without Frame) - {p.priceWithoutFrame}</option>
                    <option value={`${p.size}-with-frame`}>{p.size} (With Frame) - {p.priceWithFrame}</option>
                  </optgroup>
                ))}
              </select>
            </div>
            
            <div>
               <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-lavender-dark)' }}>Upload Reference Photo</label>
               <label style={{ display: 'block', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: '8px', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: '0.3s' }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  <Camera size={24} style={{ marginBottom: '0.5rem', opacity: 0.6 }} />
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                     {selectedFile ? `Selected: ${selectedFile.name}` : "Click to upload or drag and drop"}
                  </p>
               </label>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-lavender-dark)' }}>Additional Notes (Optional)</label>
              <textarea name="notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'var(--color-white)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }} placeholder="Any specific details to focus on?"></textarea>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ background: 'var(--color-white)', color: 'var(--color-text-dark)', marginTop: '1rem', width: '100%', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Sending...' : 'Place Order'} <ArrowRight size={18} />
            </button>
          </motion.form>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="section">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2>Proof of Work</h2>
          <p style={{ marginTop: '1rem' }}>A glimpse into our archive of commissioned portraits.</p>
        </div>

        <div className="gallery-grid">
          {gallery.map((src, i) => (
            <motion.div 
              key={i} 
              className="polaroid-card"
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 3 === 0 ? -2 : i % 2 === 0 ? 4 : -4 }}
              whileHover={{ scale: 1.08, rotate: 0, zIndex: 10, y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="polaroid-image-container">
                <img src={src} alt="Artwork" className="polaroid-image" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--color-white)', borderRadius: '48px 48px 0 0' }}>
         <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Emotional Impact</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '3rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <span style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', color: 'var(--color-lavender-dark)', lineHeight: 0.5 }}>"</span>
               <p style={{ fontSize: '1.2rem', fontStyle: 'italic', flex: 1 }}>{t.text}</p>
               <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>— {t.author}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '4rem', marginBottom: '4rem' }}>
            <div>
               <h2 style={{ color: 'var(--color-white)', fontSize: '2rem', marginBottom: '1rem' }}>JODA Arts.</h2>
               <p style={{ color: 'var(--color-lavender-dark)', fontSize: '0.9rem' }}>Premium custom black and white pencil artworks. Crafted with dedication and soul.</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
               <a href="https://www.instagram.com/j_o_h_n_c_y084?igsh=eTg0dHhzMTBnaDEy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-white)', transition: '0.3s' }}><Instagram size={24} /></a>
               <a href="mailto:johncyrebecca@gmail.com" style={{ color: 'var(--color-white)', transition: '0.3s' }}><Mail size={24} /></a>
               <a href="https://wa.me/917904309363" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.8rem 1.5rem', borderRadius: '50px', transition: '0.3s' }}>
                  <MessageCircle size={18} /> WhatsApp Quick Order
               </a>
            </div>
         </div>
         <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            &copy; {new Date().getFullYear()} JODA Arts. All rights reserved.
         </div>
      </footer>
    </>
  );
}
