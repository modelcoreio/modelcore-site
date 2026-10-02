/* =====================================================================
   HubSpot settings for modelcore.io: the only file you need to edit.
   Leave a value empty ('') and the site falls back to its built-in
   behaviour (forms open a pre-filled email; "Book a call" uses Google).
   ===================================================================== */
window.MC_HUBSPOT = {

  /* Your HubSpot account ID (Settings → Account Defaults → "Hub ID"). */
  portalId: '',

  /* The HubSpot form that receives every website inquiry.
     Marketing → Forms → open the form → the GUID is in the page URL
     (looks like 1a2b3c4d-1234-5678-9abc-1234567890ab).
     The form needs these fields: email, firstname, lastname, company,
     website, message, inquiry_type, nda_requested (see README). */
  formGuid: '',

  /* Optional: send a site form to a different HubSpot form instead.
     Keys are the inquiry types used on the site. */
  formOverrides: {
    // 'Catalogue request': '',
    // 'Custom collection': '',
    // 'Content owner': '',
    // 'Business data': '',
    // 'Data buyer': '',
    // 'General': ''
  },

  /* Your HubSpot meetings link, e.g. https://meetings.hubspot.com/your-name
     Replaces every "Book a call" link and shows an inline scheduler on /contact. */
  meetingsUrl: '',

  /* Load HubSpot's tracking code (visitor analytics + links form submissions
     to the visitor's browsing history). Turn on HubSpot's cookie banner in
     HubSpot → Settings → Privacy & Consent if you have EU/UK visitors. */
  loadTracking: true,

  /* Leave as is unless your HubSpot account is hosted in the EU data center;
     in that case confirm both addresses in HubSpot's developer docs. */
  formsEndpoint: 'https://api.hsforms.com/submissions/v3/integration/submit',
  trackingScript: 'https://js.hs-scripts.com/'
};

/* ---- no need to edit below ---- */
(function(c){
  if(c.portalId && c.loadTracking){
    var s=document.createElement('script'); s.id='hs-script-loader'; s.async=true; s.defer=true;
    s.src=c.trackingScript+encodeURIComponent(c.portalId)+'.js'; document.head.appendChild(s);
  }
})(window.MC_HUBSPOT);
