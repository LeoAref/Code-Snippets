/*
 * Custom editableFields module
 * Author: https://github.com/LeoAref
 */

var EditableField = function ($) {

    // templates
    var editor =
            '<input type="inputType" name="inputName" value="inputValue">' +
            '<span class="actionBtn submit">submitLabel</span>' +
            '<span class="actionBtn cancel">cancelLabel</span>',
        editBtn = '<span class="actionBtn edit">editLabel</span>';

    // variable
    var settings,
        defaults = {
            type: 'text',
            name: '',
            selector: '',
            submitLabel: 'Ok',
            cancelLabel: 'Cancel'
        },
        $element;

    // methods
    var init = function (options) {
            settings = _extend(defaults, options);
            $element = $(settings.selector);
            settings.value = $element.text();
            editBtn = editBtn.replace('editLabel', settings.editLabel);
            $element.append(editBtn);
            _createTemplate();
            _addEventListeners();
        },
        _createTemplate = function (newValue) {
            editor = editor.replace('inputType', settings.type);
            editor = editor.replace('inputName', settings.name);
            editor = editor.replace(newValue ? settings.oldValue : 'inputValue', newValue ? newValue : settings.value);
            editor = editor.replace('submitLabel', settings.submitLabel);
            editor = editor.replace('cancelLabel', settings.cancelLabel);
        },
        _extend = function (src, dest) {
            if (typeof src === 'object' && typeof dest === 'object') {
                for (var key in dest) {
                    if (dest.hasOwnProperty(key)) {
                        src[key] = dest[key];
                    }
                }
                return src;
            } else {
                console.log('Source and destination must be objects!');
            }
        },
        _addEventListeners = function () {
            $(document).on('click', settings.selector + ' .actionBtn', function () {
                var $actionBtn = $(this);

                if ($actionBtn.hasClass('edit')) {
                    _edit();
                }

                else if ($actionBtn.hasClass('submit')) {
                    _submit();
                }

                else if ($actionBtn.hasClass('cancel')) {
                    _cancel();
                }
            });
        },
        _edit = function () {
            $element.html(editor);
            typeof settings.editCallback === 'function' && settings.editCallback();
        },
        _submit = function () {
            if(settings.required && $element.find('input').val().trim() === '') {
                typeof settings.requiredErrorHandler === 'function' && settings.requiredErrorHandler();
            } else if(settings.type === 'email' && !$element.find('input').val().trim().match(/.+@.+\..+/i)) {
                typeof settings.invalidErrorHandler === 'function' && settings.invalidErrorHandler();
            } else {
                settings.oldValue = settings.value;
                settings.value = $element.find('input').val();
                typeof settings.submitCallback === 'function' && settings.submitCallback(settings.value, settings.oldValue);
            }
            $element.html(settings.value + editBtn);
            _createTemplate(settings.value);
        },
        _cancel = function () {
            $element.html(settings.value + editBtn);
            typeof settings.cancelCallback === 'function' && settings.cancelCallback();
        };

    this.init = init;
};