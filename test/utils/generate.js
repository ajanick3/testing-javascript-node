var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import faker from 'faker';
import { getUserToken, getSaltAndHash } from '../../src/utils/auth';
// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
var getPassword = function () {
    var _a;
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return "!0_Oo" + (_a = faker.internet).password.apply(_a, args);
};
var getUsername = faker.internet.userName;
var getId = faker.random.uuid;
var getSynopsis = faker.lorem.paragraph;
var getNotes = faker.lorem.paragraph;
function buildUser(_a) {
    if (_a === void 0) { _a = {}; }
    var _b = _a.password, password = _b === void 0 ? getPassword() : _b, overrides = __rest(_a, ["password"]);
    return __assign(__assign({ id: getId(), username: getUsername() }, getSaltAndHash(password)), overrides);
}
function buildBook(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ id: getId(), title: faker.lorem.words(), author: faker.name.findName(), coverImageUrl: faker.image.imageUrl(), pageCount: faker.random.number(400), publisher: faker.company.companyName(), synopsis: faker.lorem.paragraph() }, overrides);
}
function buildListItem(overrides) {
    var _a, _b;
    var _c = overrides.bookId, bookId = _c === void 0 ? (_a = overrides.bookId) !== null && _a !== void 0 ? _a : getId() : _c, _d = overrides.startDate, startDate = _d === void 0 ? faker.date.past(2) : _d, _e = overrides.finishDate, finishDate = _e === void 0 ? faker.date.between(startDate, new Date()) : _e, _f = overrides.ownerId, ownerId = _f === void 0 ? (_b = overrides.ownerId) !== null && _b !== void 0 ? _b : getId() : _f;
    return __assign({ id: getId(), bookId: bookId,
        ownerId: ownerId, rating: faker.random.number(5), notes: faker.random.boolean() ? '' : getNotes(), finishDate: finishDate,
        startDate: startDate }, overrides);
}
function token(user) {
    return getUserToken(buildUser(user));
}
function loginForm(overrides) {
    return __assign({ username: getUsername(), password: getPassword() }, overrides);
}
function buildReq(_a) {
    if (_a === void 0) { _a = {}; }
    var _b = _a.user, user = _b === void 0 ? buildUser() : _b, overrides = __rest(_a, ["user"]);
    var req = __assign({ user: user, body: {}, params: {} }, overrides);
    return req;
}
function buildRes(overrides) {
    if (overrides === void 0) { overrides = {}; }
    var res = __assign({ json: jest.fn(function () { return res; }).mockName('json'), status: jest.fn(function () { return res; }).mockName('status') }, overrides);
    return res;
}
function buildNext(impl) {
    return jest.fn(impl).mockName('next');
}
export { buildReq, buildRes, buildNext, buildUser, buildListItem, buildBook, token, loginForm, getPassword as password, getUsername as username, getId as id, getSynopsis as synopsis, getNotes as notes, };
