<div id="sidepanel">
    <div id="profile">
        <div class="wrap">
            <img id="profile-img" src="{{ asset('default-images/user-default.jpg') }}" class="online" alt="" />
            <p>{{ Auth::user()->name }}</p>
            <i class="fa fa-chevron-down expand-button" aria-hidden="true"></i>
            <div id="status-options">
                <ul>
                    <li id="status-online" class="active"><span class="status-circle"></span>
                        <p>Online</p>
                    </li>
                    <li id="status-away"><span class="status-circle"></span>
                        <p>Away</p>
                    </li>
                    <li id="status-busy"><span class="status-circle"></span>
                        <p>Busy</p>
                    </li>
                    <li id="status-offline"><span class="status-circle"></span>
                        <p>Offline</p>
                    </li>
                </ul>
            </div>

        </div>
    </div>
    <hr>
    <div id="contacts">
        <ul>
            @forelse ($users as $user)
                <li class="contact" data-id="{{ $user->id }}">
                    <div class="wrap">
                        <span class="contact-status offline"></span>
                        <img src="{{ asset('default-images/user-default.jpg') }}" alt="" />
                        <div class="meta">
                            <p class="name">{{ $user->name }}</p>
                            <p class="preview">{{ $user->email }}</p>
                        </div>
                    </div>
                </li>
            @empty
                <p class="text-center">No users found.</p>
            @endforelse
        </ul>
    </div>

    <div class="text-center">
        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="btn btn-danger">Logout</button>
        </form>
    </div>

</div>
