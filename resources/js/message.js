const selectedContact = $('meta[name="selected_contact"]');
const authId = $('meta[name="auth_id"]').attr("content");
const baseUrl = $('meta[name="base_url"]').attr("content");
const inbox = $(".messages ul");

function toggleLoader() {
    $(".loader").toggleClass("d-none");
}

function messageTemplate(text, className) {
    return `
        <li class="${className}">
            <img src="${baseUrl}/default-images/user-default.jpg" alt="" />
            <p>${text}</p>
        </li>
    `;
}

function fetchMessage() {
    let contactId = selectedContact.attr("content");
    $.ajax({
        type: "GET",
        url: baseUrl + "/fetch-messages",
        data: {
            contact_id: contactId,
        },
        beforeSend: function () {
            toggleLoader();
        },
        success: function (response) {
            setContactInfo(response.contact);
            // append messages
            inbox.empty();
            response.messages.forEach((value) => {
                if (value.form_id == contactId) {
                    inbox.append(messageTemplate(value.message, "sent"));
                } else {
                    inbox.append(messageTemplate(value.message, "replies"));
                }
            });
            scrollToBottom();
        },
        error: function (xhr, status, error) {},
        complete: function () {
            toggleLoader();
        },
    });
}

function sendMessage() {
    let messageBox = $(".message-box");
    let contactId = selectedContact.attr("content");
    let formData = $(".message-form").serialize();
    $.ajax({
        type: "POST",
        url: baseUrl + "/send-message",
        data: formData + "&contact_id=" + contactId,
        beforeSend: function () {
            let message = messageBox.val();
            inbox.append(messageTemplate(message, "replies"));
            messageBox.val("");
            scrollToBottom();
        },
        success: function (response) {},
        error: function (xhr, status, error) {},
    });
}

function setContactInfo(contact) {
    $(".contact-name").text(contact.name);
}

function scrollToBottom() {
    $(".messages")
        .stop()
        .animate({
            scrollTop: $(".messages")[0].scrollHeight,
        });
}

$(document).ready(function () {
    // set contact id on meta
    $(".contact").on("click", function () {
        let contactId = $(this).data("id");
        selectedContact.attr("content", contactId);

        // hide the blank wrap
        $(".blank-wrap").hide();

        // fetch messages
        fetchMessage();
    });

    $(".message-form").on("submit", function (e) {
        e.preventDefault();
        sendMessage();
    });
});

// listen to the live events
window.Echo.private("message." + authId).listen("SendMessage", (event) => {
    if (event.form_id == selectedContact.attr("content")) {
        inbox.append(messageTemplate(event.text, "sent"));
        scrollToBottom();
    }
});

window.Echo.join("online")
    .here((users) => {
        users.forEach((user) => {
            let element = $(`.contact[data-id="${user.id}"]`);
            if (element.length > 0) {
                element.find(".contact-status").removeClass("offline");
                element.find(".contact-status").addClass("online");
            } else {
                element.find(".contact-status").removeClass("online");
                element.find(".contact-status").addClass("offline");
            }
        });
    })
    .joining((user) => {
        let element = $(`.contact[data-id="${user.id}"]`);
        element.find(".contact-status").removeClass("offline");
        element.find(".contact-status").addClass("online");
    })
    .leaving((user) => {
        let element = $(`.contact[data-id="${user.id}"]`);
        element.find(".contact-status").removeClass("online");
        element.find(".contact-status").addClass("offline");
    });
