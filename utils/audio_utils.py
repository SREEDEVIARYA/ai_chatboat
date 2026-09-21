import os


def clean_audio_folder(
    folder="audio"
):

    if not os.path.exists(folder):

        return


    for filename in os.listdir(folder):

        if filename.endswith(".mp3"):

            filepath = os.path.join(
                folder,
                filename
            )


            try:

                os.remove(filepath)

            except Exception as e:

                print(
                    f"Could not delete {filepath}: {e}"
                )