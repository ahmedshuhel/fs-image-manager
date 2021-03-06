import { EventAggregator } from 'aurelia-event-aggregator';
import { DirectoryClicked, HomeClicked, BreadcrumbClicked, BackButtonClicked } from '../../messages';

export class Breadcrumbs {
    static inject = [EventAggregator]
    dirs = []
    constructor(ea) {
        this.ea = ea;
        let breadcrumb = this;
        this.ea.subscribe(DirectoryClicked, msg => {
            let dir = msg.directory;
            let foundIndex = breadcrumb._findIndex(dir);
            if (foundIndex <= -1) {
                this.dirs.push(dir);
            } else {
                this.dirs.splice(foundIndex + 1, this.dirs.length - foundIndex - 1);
            }
        });
        ea.subscribe(HomeClicked, msg => {
            this.dirs.splice(0, this.dirs.length);
        });
        ea.subscribe(BackButtonClicked, msg => {
            this.dirs.pop();
        });
    }

    _findIndex(dir) {
        let foundIndex = -1;
        for (let index = 0; index < this.dirs.length; ++index) {
            if (this.dirs[index].ListURI === dir.ListURI) {
                foundIndex = index;
            }
        }
        return foundIndex;
    }

    clickBreadcrumb(dir) {
        let dirChanged = this._findIndex(dir) + 1 === this.dirs.length;
        this.ea.publish(new DirectoryClicked(dir));
        this.ea.publish(new BreadcrumbClicked(dir));
        if (dirChanged) {
            return false;
        }
        return true;
    }

    clickHome() {
        this.ea.publish(new HomeClicked());
        return true;
    }
}
