function doPost(e) {

  /* ===== הגדרות ===== */
  var OWNER_EMAIL = "owner@example.com";
  var SITE_NAME   = "שם האתר";
  /* ================= */

  // Helper function to escape HTML
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  var data;
  
  // Try to parse JSON first, fall back to form parameters
  if (e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (error) {
      // If JSON parsing fails, use form parameters
      data = e.parameter;
    }
  } else {
    // Use form parameters if no postData
    data = e.parameter;
  }

  var name    = data.name;
  var email   = data.email;
  var message = data.message;

  // Validate required fields
  if (!name || !email || !message) {
    return ContentService
      .createTextOutput(
        '<script>' +
          'window.parent.postMessage(' + JSON.stringify({ success: false, error: "Missing required fields" }) + ', "*");' +
        '</script>'
      )
      .setMimeType(ContentService.MimeType.HTML);
  }

  // Trim inputs
  name = String(name).trim();
  email = String(email).trim();
  message = String(message).trim();

  // Validate email format
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ContentService
      .createTextOutput(
        '<script>' +
          'window.parent.postMessage(' + JSON.stringify({ success: false, error: "Invalid email format" }) + ', "*");' +
        '</script>'
      )
      .setMimeType(ContentService.MimeType.HTML);
  }

  /* ===== מייל לבעל האתר (HTML) ===== */
  var ownerSubject = "פנייה חדשה – " + SITE_NAME;

  var ownerHtml =
    '<div style="font-family:Arial; direction:rtl;">' +
      '<h2>פנייה חדשה מטופס יצירת קשר</h2>' +
      '<p><strong>שם:</strong> ' + escapeHtml(name) + '</p>' +
      '<p><strong>אימייל:</strong> ' + escapeHtml(email) + '</p>' +
      '<p><strong>הודעה:</strong></p>' +
      '<div style="border:1px solid #ccc; padding:10px;">' +
        escapeHtml(message).replace(/\n/g, '<br>') +
      '</div>' +
    '</div>';

  try {
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: ownerSubject,
      htmlBody: ownerHtml,
      body: "פנייה חדשה התקבלה באתר " + SITE_NAME
    });

    /* ===== מייל לשולח (HTML) ===== */
    var senderSubject = "קיבלנו את פנייתך – " + SITE_NAME;

    var senderHtml =
      '<div style="font-family:Arial; direction:rtl; text-align:right;">' +
        '<h2>תודה שפנית אלינו</h2>' +
        '<p>שלום ' + escapeHtml(name) + ',</p>' +
        '<p>תודה על פנייתך.</p>' +
        '<p>פנייתך חשובה לנו ותטופל בהקדם.</p>' +
        '<hr>' +
        '<p style="font-size:12px; color:#666;">' +
          SITE_NAME +
        '</p>' +
      '</div>';

    MailApp.sendEmail({
      to: email,
      subject: senderSubject,
      htmlBody: senderHtml,
      body: "תודה על פנייתך, נחזור אליך בהקדם."
    });

    return ContentService
      .createTextOutput(
        '<script>' +
          'window.parent.postMessage(' + JSON.stringify({ success: true }) + ', "*");' +
        '</script>'
      )
      .setMimeType(ContentService.MimeType.HTML);
      
  } catch (error) {
    return ContentService
      .createTextOutput(
        '<script>' +
          'window.parent.postMessage(' + JSON.stringify({ success: false, error: "Failed to send email" }) + ', "*");' +
        '</script>'
      )
      .setMimeType(ContentService.MimeType.HTML);
  }
