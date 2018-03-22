export default {
  files() {
    const {google} = window;
    return new google.picker.DocsView()
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false)
      .setParent('root')
      .setLabel('My Drive');
  },

  sharedFiles() {
    const {google} = window;
    return new google.picker.DocsView()
      .setIncludeFolders(true)
      .setOwnedByMe(false)
      .setSelectFolderEnabled(false)
      .setLabel('Shared with Me');
  },

  starredFiles() {
    const {google} = window;
    return new google.picker.DocsView()
      .setIncludeFolders(false)
      .setSelectFolderEnabled(false)
      .setStarred(true)
      .setLabel('Starred');
  },

  teamDriveFiles() {
    return new window.google.picker.DocsView()
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false)
      .setEnableTeamDrives(true);
  },

  recentFiles() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.RECENTLY_PICKED)
      .setIncludeFolders(true)
      .setLabel('Recent');
  },

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
      .setOwnedByMe(false)
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

  teamDriveSheets() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false)
      .setEnableTeamDrives(true);
  },

  recentSheets() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.RECENTLY_PICKED)
      .setMimeTypes('application/vnd.google-apps.spreadsheet')
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false)
      .setLabel('Recent');
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
    recentView.setLabel('Recent');
    return recentView;
  },

  flatFolders() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(true)
      .setMimeTypes('application/vnd.google-apps.folder');
  },

  rootFolder() {
    const {google} = window;
    return new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(true)
      .setMimeTypes('application/vnd.google-apps.folder')
      .setParent('root');
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
  },

  teamDriveFolders() {
    return new window.google.picker.DocsView()
      .setSelectFolderEnabled(true)
      .setMimeTypes('application/vnd.google-apps.folder')
      .setEnableTeamDrives(true);
  }
};
