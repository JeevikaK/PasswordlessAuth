import os
import glob
import wfdb
import biosppy
import matplotlib.pyplot as plt

def get_records(fol_path):
    """ To get file paths """
    
    # There are 3 files for each record
    # *.atr is one of them
    paths = glob.glob(fol_path)
    print(paths)

    # Get rid of the extension
    paths = [path[:-4] for path in paths]
    paths.sort()
    print(paths)
    return paths
  
def save_fig(data, filename):
    """ Convert signal to Image"""

    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    plt.axis('off')
    plt.plot(data)

    extent = ax.get_window_extent().transformed(fig.dpi_scale_trans.inverted())
    plt.savefig(filename, bbox_inches=extent)
    print(filename)
    plt.close()
    
def segmentation(filename):
    """ Gets the ECG segment (wave) and saves to image """

    # to save images in new folder
    # folder = '/'.join(filename.replace('1.0.0', 'filter').split('/')[:-1])
    old_folder_sep = filename.split('\\')[:-1]
    old_folder_sep[0] = old_folder_sep[0] + '-filter'
    folder = '/'.join(old_folder_sep)
    print(folder, "new folder")
    filename_new = filename.split('\\')[-1]
    print(filename_new, "new file name")
    
    if not os.path.exists(folder):
        print("Creating new folder")
        os.makedirs(folder)
    
    # reads raw signal (ECG I)
    print(filename, "for record")
    record = wfdb.rdsamp(filename)
    print("record" , record)
    # get the first column signal
    data = record[0][:,1]
    signals = []
    count = 1

    # apply Christov Segmenter to get separate waves
    peaks =  biosppy.signals.ecg.christov_segmenter(signal=data, sampling_rate=record[1]['fs'])[0]
    for i in (peaks[1:-1]):
        diff1 = abs(peaks[count - 1] - i)
        diff2 = abs(peaks[count + 1] - i)
        x = peaks[count - 1] + diff1//2
        y = peaks[count + 1] - diff2//2
        signal = data[x:y]
        signals.append(signal)
        count += 1
    print("count", count)
    print("signals", len(signals))           
    # save the first wave as the image
    save_fig(signals[0], '/'.join([folder, filename_new]))

if __name__ == '__main__':
    # records = get_records('path-to-the-directory/ecg-id-database-1.0.0/*/*.atr')
    records = get_records('ecg-id-test/*/*.atr')
    print(records)
    for record in records:
        print('\n')
        print(record)
        segmentation(record)
