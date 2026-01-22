function doPost(e) {

  /* ===== הגדרות ===== */
  var OWNER_EMAIL = "owner@example.com";
  var SITE_NAME   = "שם האתר";
  /* ================= */

  var data = JSON.parse(e.postData.contents);

  var name    = data.name;
  var email   = data.email;
  var message = data.message;

  /* ===== מייל לבעל האתר (HTML) ===== */
  var ownerSubject = "פנייה חדשה – " + SITE_NAME;

  var ownerHtml =
    '<div style="font-family:Arial; direction:rtl;">' +
      '<h2>פנייה חדשה מטופס יצירת קשר</h2>' +
      '<p><strong>שם:</strong> ' + name + '</p>' +
      '<p><strong>אימייל:</strong> ' + email + '</p>' +
      '<p><strong>הודעה:</strong></p>' +
      '<div style="border:1px solid #ccc; padding:10px;">' +
        message.replace(/\n/g, '<br>') +
      '</div>' +
    '</div>';

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
      '<p>שלום ' + name + ',</p>' +
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
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}
