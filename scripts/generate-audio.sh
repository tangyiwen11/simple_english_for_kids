#!/bin/zsh
set -euo pipefail

project_dir=${0:A:h:h}
audio_dir="$project_dir/public/audio"
word_dir="$audio_dir/words"
letter_dir="$audio_dir/letters"
temp_audio="/tmp/little-phonics-source.aiff"

mkdir -p "$word_dir" "$letter_dir"

words=(
  apple ant ax alligator ambulance astronaut
  ball banana bear bed bird book
  cat car cup cow cake corn
  dog duck door doll drum dad
  egg elephant elbow engine envelope exit
  fish frog fan foot fork flower
  goat game gift grapes green girl
  hat hand house horse heart hippo
  ink insect igloo iguana itch ill
  jam jet juice jacket jelly jump
  key king kite kitten kangaroo kitchen
  lion leg leaf lamp lemon lunch
  moon milk map mouse mouth monkey
  nose nest net nut nurse night
  octopus ox otter ostrich olive on
  pig pen pan pizza panda park
  queen quilt question quiet quack quick
  rabbit rain red ring robot run
  sun sock soap soup seal sit
  tiger tree tomato turtle train tent
  umbrella up under uncle unhappy umpire
  van vase vest violin vegetable vacuum
  water watch window wolf web walk
  box fox six taxi x-ray wax
  yellow yak yo-yo yogurt yarn yes
  zebra zoo zip zero zigzag zipper
  at mat sat pin tap nap can
)

for word in "${words[@]}"; do
  say -v Daniel -r 145 -o "$temp_audio" "$word"
  /opt/homebrew/bin/ffmpeg \
    -y -loglevel error \
    -i "$temp_audio" \
    -af "loudnorm=I=-18:TP=-2:LRA=7,apad=pad_dur=0.18" \
    -codec:a libmp3lame -q:a 4 \
    "$word_dir/$word.mp3"
done

# Modern macOS voices do not reliably honor the legacy PHON command. Instead,
# isolate each sound from a carefully chosen word. This keeps the clip short
# and prevents either command text or a letter name from leaking into it.
make_initial_sound() {
  local letter=$1
  local source_word=$2
  local clip_end=$3
  local tempo=$4
  local fade_start=$5
  local fade_duration=$6
  local padding=$7
  local filter="atrim=start=0:end=$clip_end,asetpts=PTS-STARTPTS"

  if [[ "$tempo" != "1" ]]; then
    filter+=",atempo=$tempo"
  fi

  filter+=",afade=t=out:st=$fade_start:d=$fade_duration,loudnorm=I=-18:TP=-2:LRA=7,apad=pad_dur=$padding"

  /opt/homebrew/bin/ffmpeg \
    -y -loglevel error \
    -i "$word_dir/$source_word.mp3" \
    -af "$filter" \
    -codec:a libmp3lame -q:a 4 \
    "$letter_dir/$letter.mp3"
}

make_initial_sound a apple 0.145 0.5 0.20 0.08 0.16
make_initial_sound b ball 0.070 1 0.045 0.025 0.22
make_initial_sound c cat 0.075 1 0.050 0.025 0.22
make_initial_sound d dog 0.075 1 0.050 0.025 0.22
make_initial_sound e egg 0.145 0.5 0.20 0.08 0.16
make_initial_sound f fish 0.140 0.5 0.20 0.08 0.16
make_initial_sound g goat 0.080 1 0.050 0.030 0.22
make_initial_sound h hat 0.125 0.8 0.105 0.050 0.18
make_initial_sound i ink 0.135 0.5 0.19 0.08 0.16
make_initial_sound j jam 0.100 0.8 0.085 0.040 0.20
make_initial_sound k key 0.075 1 0.050 0.025 0.22
make_initial_sound l lion 0.115 0.7 0.115 0.050 0.18
make_initial_sound m moon 0.115 0.5 0.16 0.07 0.16
make_initial_sound n nose 0.115 0.5 0.16 0.07 0.16
make_initial_sound o ox 0.150 0.5 0.21 0.08 0.16
make_initial_sound p pig 0.070 1 0.045 0.025 0.22
make_initial_sound q queen 0.110 0.8 0.095 0.040 0.20
make_initial_sound r rabbit 0.115 0.7 0.115 0.050 0.18
make_initial_sound s sun 0.130 0.5 0.19 0.07 0.16
make_initial_sound t tent 0.075 1 0.045 0.030 0.22
make_initial_sound u umbrella 0.145 0.5 0.20 0.08 0.16
make_initial_sound v van 0.130 0.5 0.19 0.07 0.16
make_initial_sound w water 0.120 0.7 0.12 0.05 0.18
make_initial_sound y yellow 0.120 0.7 0.12 0.05 0.18
make_initial_sound z zebra 0.130 0.5 0.19 0.07 0.16

# X is most naturally heard at the end of simple words such as "box".
/opt/homebrew/bin/ffmpeg \
  -y -loglevel error \
  -i "$word_dir/box.mp3" \
  -af "atrim=start=0.26:end=0.48,asetpts=PTS-STARTPTS,afade=t=out:st=0.16:d=0.06,loudnorm=I=-18:TP=-2:LRA=7,apad=pad_dur=0.16" \
  -codec:a libmp3lame -q:a 4 \
  "$letter_dir/x.mp3"

echo "Generated ${#words[@]} word clips and 26 clean letter sounds."
