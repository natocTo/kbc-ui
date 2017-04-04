export default {
  sheets() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false)
      .setParent('root')
      .setLabel('My Drive');
  },

  sharedSheets() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
      .setIncludeFolders(true)
      // .setOwnedByMe(true)
      .setSelectFolderEnabled(false)
      .setLabel('Shared with Me');
  },

  starredSheets() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
      .setIncludeFolders(false)
      .setSelectFolderEnabled(false)
      .setStarred(true)
      .setLabel('Starred');
  },

  root(foldersOnly) {
    const view = new window.google.picker.DocsView();
    view.setIncludeFolders(true);
    if (foldersOnly) {
      view.setSelectFolderEnabled(true);
      view.setMimeTypes('application/vnd.google-apps.folder');
    }
    view.setParent('root');
    return view;
  },

  flat(foldersOnly) {
    const allFoldersView = new window.google.picker.DocsView();
    allFoldersView.setIncludeFolders(true);
    if (foldersOnly) {
      allFoldersView.setSelectFolderEnabled(true);
      allFoldersView.setMimeTypes('application/vnd.google-apps.folder');
    }
    return allFoldersView;
  },

  recent(foldersOnly) {
    const {google} = window;
    const recentView = new google.picker.DocsView(google.picker.ViewId.RECENTLY_PICKED);
    if (foldersOnly) {
      recentView.setMimeTypes('application/vnd.google-apps.folder');
      recentView.setSelectFolderEnabled(true);
    }
    recentView.setIncludeFolders(true);
    return recentView;
  },

  flatFolders() {
    const {google} = window;
    const allFoldersView = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
    allFoldersView.setIncludeFolders(true);
    allFoldersView.setSelectFolderEnabled(true);
    allFoldersView.setMimeTypes('application/vnd.google-apps.folder');
    return allFoldersView;
  },

  rootFolder() {
    const {google} = window;
    const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
    view.setIncludeFolders(true);
    view.setSelectFolderEnabled(true);
    view.setMimeTypes('application/vnd.google-apps.folder');
    view.setParent('root');
    return view;
  },

  sharedFolders() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setIncludeFolders(true)
      .setOwnedByMe(false)
      .setSelectFolderEnabled(true)
      .setLabel('Shared with Me');
  },

  starredFolders() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(true)
      .setStarred(true)
      .setLabel('Starred');
  }
};
